import prisma from "../lib/prisma.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    const departmentId = req.user.departmentId;

    let dashboardData = {};

    const commonStats = await getCommonStats(departmentId, userRole);

    switch (userRole) {
      case "ADMIN":
        dashboardData = await getAdminDashboard();
        break;

      case "PROCUREMENT_OFFICER":
        dashboardData = await getProcurementDashboard();
        break;

      case "STOREKEEPER":
        dashboardData = await getStorekeeperDashboard();
        break;

      case "DEPARTMENT_HEAD":
        dashboardData = await getDepartmentHeadDashboard(departmentId, userId);
        break;

      default:
        dashboardData = commonStats;
    }

    const result = {
      ...commonStats,
      ...dashboardData,
      userRole,
      timestamp: new Date().toISOString(),
    };

    res.json(result);
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard statistics" });
  }
};

// Common statistics for all roles
async function getCommonStats(departmentId, userRole) {
  let requisitionWhere = {};
  let serviceRequestWhere = {};

  if (userRole === "DEPARTMENT_HEAD") {
    requisitionWhere.departmentId = departmentId;
    serviceRequestWhere.departmentId = departmentId;
  }

  const [requisitionStats, serviceRequestStats, lowStockItems] =
    await Promise.all([
      prisma.requisition.groupBy({
        by: ["status"],
        where: requisitionWhere,
        _count: { id: true },
      }),

      prisma.serviceRequest.groupBy({
        by: ["status"],
        where: serviceRequestWhere,
        _count: { id: true },
      }),

      userRole === "STOREKEEPER" || userRole === "ADMIN"
        ? prisma.item.findMany({
            where: {
              quantity: {
                lte: prisma.item.fields.minQuantity,
              },
            },
            include: {
              category: {
                select: {
                  name: true,
                },
              },
            },
            orderBy: { quantity: "asc" },
            take: 10,
          })
        : Promise.resolve([]),
    ]);

  const formattedRequisitionStats = {
    PENDING: 0,
    APPROVED: 0,
    REJECTED: 0,
    FULFILLED: 0,
    total: 0,
  };

  requisitionStats.forEach((stat) => {
    formattedRequisitionStats[stat.status] = stat._count.id;
    formattedRequisitionStats.total += stat._count.id;
  });

  const formattedServiceRequestStats = {
    PENDING: 0,
    APPROVED: 0,
    REJECTED: 0,
    total: 0,
  };

  serviceRequestStats.forEach((stat) => {
    formattedServiceRequestStats[stat.status] = stat._count.id;
    formattedServiceRequestStats.total += stat._count.id;
  });

  return {
    requisitions: formattedRequisitionStats,
    serviceRequests: formattedServiceRequestStats,
    lowStockItems: lowStockItems.map((item) => ({
      id: item.id,
      name: item.name,
      currentQuantity: item.quantity,
      minQuantity: item.minQuantity,
      unit: item.unit,
      category: item.category.name,
      needsRestock: item.quantity <= item.minQuantity,
    })),
  };
}

// Admin-specific dashboard data
async function getAdminDashboard() {
  const [totalUsers, totalDepartments, totalItems, recentActivity] =
    await Promise.all([
      prisma.user.count(),
      prisma.department.count(),
      prisma.item.count(),
      prisma.requisition.findMany({
        include: {
          department: {
            select: { name: true },
          },
          createdBy: {
            select: { firstName: true, lastName: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  return {
    totalUsers,
    totalDepartments,
    totalItems,
    recentActivity: recentActivity.map((req) => ({
      id: req.id,
      title: req.title,
      status: req.status,
      department: req.department.name,
      createdBy: `${req.createdBy.firstName} ${req.createdBy.lastName}`,
      createdAt: req.createdAt,
    })),
  };
}

// Procurement officer-specific dashboard data
async function getProcurementDashboard() {
  const [pendingRequisitions, pendingServiceRequests, recentDecisions] =
    await Promise.all([
      prisma.requisition.findMany({
        where: { status: "PENDING" },
        include: {
          department: {
            select: { name: true },
          },
          createdBy: {
            select: { firstName: true, lastName: true },
          },
          items: {
            include: {
              item: {
                select: { name: true, unit: true },
              },
            },
          },
        },
        orderBy: { createdAt: "asc" },
        take: 10,
      }),
      prisma.serviceRequest.findMany({
        where: { status: "PENDING" },
        include: {
          department: {
            select: { name: true },
          },
          createdBy: {
            select: { firstName: true, lastName: true },
          },
        },
        orderBy: { createdAt: "asc" },
        take: 10,
      }),
      prisma.requisition.findMany({
        where: {
          status: { in: ["APPROVED", "REJECTED"] },
          processedById: { not: null },
        },
        include: {
          department: {
            select: { name: true },
          },
          processedBy: {
            select: { firstName: true, lastName: true },
          },
        },
        orderBy: { processedAt: "desc" },
        take: 5,
      }),
    ]);

  return {
    pendingApprovals: {
      requisitions: pendingRequisitions.length,
      serviceRequests: pendingServiceRequests.length,
      total: pendingRequisitions.length + pendingServiceRequests.length,
    },
    pendingRequisitions: pendingRequisitions.map((req) => ({
      id: req.id,
      title: req.title,
      department: req.department.name,
      createdBy: `${req.createdBy.firstName} ${req.createdBy.lastName}`,
      items: req.items.length,
      createdAt: req.createdAt,
    })),
    pendingServiceRequests: pendingServiceRequests.map((sr) => ({
      id: sr.id,
      title: sr.title,
      department: sr.department.name,
      createdBy: `${sr.createdBy.firstName} ${sr.createdBy.lastName}`,
      createdAt: sr.createdAt,
    })),
    recentDecisions: recentDecisions.map((decision) => ({
      id: decision.id,
      title: decision.title,
      status: decision.status,
      department: decision.department.name,
      processedBy: decision.processedBy
        ? `${decision.processedBy.firstName} ${decision.processedBy.lastName}`
        : "System",
      processedAt: decision.processedAt,
    })),
  };
}

// Storekeeper-specific dashboard data
async function getStorekeeperDashboard() {
  const [approvedRequisitions, totalInventoryValue, recentTransactions] =
    await Promise.all([
      prisma.requisition.findMany({
        where: { status: "APPROVED" },
        include: {
          department: {
            select: { name: true },
          },
          createdBy: {
            select: { firstName: true, lastName: true },
          },
          items: {
            include: {
              item: {
                select: { name: true, unit: true, quantity: true },
              },
            },
          },
        },
        orderBy: { createdAt: "asc" },
        take: 10,
      }),
      prisma.item.aggregate({
        _sum: { quantity: true },
      }),
      prisma.transaction.findMany({
        include: {
          item: {
            select: { name: true, unit: true },
          },
          user: {
            select: { firstName: true, lastName: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      }),
    ]);

  return {
    pendingFulfillment: {
      count: approvedRequisitions.length,
      requisitions: approvedRequisitions.map((req) => ({
        id: req.id,
        title: req.title,
        department: req.department.name,
        createdBy: `${req.createdBy.firstName} ${req.createdBy.lastName}`,
        items: req.items.length,
        createdAt: req.createdAt,
      })),
    },
    inventorySummary: {
      totalItems: totalInventoryValue._sum.quantity || 0,
      lowStockCount: await prisma.item.count({
        where: {
          quantity: {
            lte: prisma.item.fields.minQuantity,
          },
        },
      }),
    },
    recentActivity: recentTransactions.map((transaction) => ({
      id: transaction.id,
      type: transaction.type,
      item: transaction.item.name,
      quantity: Math.abs(transaction.quantity),
      unit: transaction.item.unit,
      user: transaction.user
        ? `${transaction.user.firstName} ${transaction.user.lastName}`
        : "System",
      notes: transaction.notes,
      createdAt: transaction.createdAt,
    })),
  };
}

// Department head-specific dashboard data
async function getDepartmentHeadDashboard(departmentId, userId) {
  const [myRequisitions, myServiceRequests, departmentSummary] =
    await Promise.all([
      prisma.requisition.findMany({
        where: {
          departmentId: departmentId,
          createdById: userId,
        },
        include: {
          items: {
            include: {
              item: {
                select: { name: true },
              },
            },
          },
          processedBy: {
            select: { firstName: true, lastName: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.serviceRequest.findMany({
        where: {
          departmentId: departmentId,
          createdById: userId,
        },
        include: {
          processedBy: {
            select: { firstName: true, lastName: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.department.findUnique({
        where: { id: departmentId },
        select: {
          name: true,
          users: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              role: true,
            },
          },
        },
      }),
    ]);

  return {
    myRequests: {
      requisitions: myRequisitions.map((req) => ({
        id: req.id,
        title: req.title,
        status: req.status,
        items: req.items.length,
        processedBy: req.processedBy
          ? `${req.processedBy.firstName} ${req.processedBy.lastName}`
          : null,
        createdAt: req.createdAt,
      })),
      serviceRequests: myServiceRequests.map((sr) => ({
        id: sr.id,
        title: sr.title,
        status: sr.status,
        processedBy: sr.processedBy
          ? `${sr.processedBy.firstName} ${sr.processedBy.lastName}`
          : null,
        createdAt: sr.createdAt,
      })),
    },
    departmentInfo: {
      name: departmentSummary.name,
      totalMembers: departmentSummary.users.length,
      members: departmentSummary.users.map((user) => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        role: user.role,
      })),
    },
  };
}
