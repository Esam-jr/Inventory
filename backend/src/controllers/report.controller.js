import prisma from "../lib/prisma.js";
import { Parser } from "json2csv";

// Generate inventory report
export const generateInventoryReport = async (req, res) => {
  const { format = "json", categoryId } = req.query;

  try {
    let whereClause = {};

    if (categoryId) {
      whereClause.categoryId = parseInt(categoryId);
    }

    const inventory = await prisma.item.findMany({
      where: whereClause,
      include: {
        category: {
          select: {
            name: true,
          },
        },
        transactions: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
          select: {
            type: true,
            quantity: true,
            createdAt: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
      orderBy: [{ categoryId: "asc" }, { name: "asc" }],
    });

    // Format the data
    const reportData = inventory.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      category: item.category.name,
      currentStock: item.quantity,
      minimumStock: item.minQuantity,
      unit: item.unit,
      status: item.quantity <= item.minQuantity ? "LOW_STOCK" : "OK",
      lastUpdated: item.updatedAt,
    }));

    if (format === "csv") {
      try {
        const parser = new Parser();
        const csv = parser.parse(reportData);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=inventory-report.csv"
        );
        res.send(csv);
      } catch (csvError) {
        console.error("CSV conversion error:", csvError);
        res.status(500).json({ error: "Failed to generate CSV report" });
      }
    } else {
      res.json({
        generatedAt: new Date().toISOString(),
        totalItems: reportData.length,
        lowStockItems: reportData.filter((item) => item.status === "LOW_STOCK")
          .length,
        data: reportData,
      });
    }
  } catch (error) {
    console.error("Generate inventory report error:", error);
    res.status(500).json({ error: "Failed to generate inventory report" });
  }
};

// Generate transaction report
export const generateTransactionReport = async (req, res) => {
  const { format = "json", startDate, endDate, type, itemId } = req.query;

  try {
    let whereClause = {};

    // Date filter
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = new Date(startDate);
      if (endDate) whereClause.createdAt.lte = new Date(endDate);
    }

    // Type filter
    if (type) {
      whereClause.type = type;
    }

    // Item filter
    if (itemId) {
      whereClause.itemId = parseInt(itemId);
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      include: {
        item: {
          select: {
            name: true,
            unit: true,
            category: {
              select: {
                name: true,
              },
            },
          },
        },
        user: {
          select: {
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        requisition: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const reportData = transactions.map((transaction) => ({
      id: transaction.id,
      date: transaction.createdAt,
      type: transaction.type,
      item: transaction.item.name,
      category: transaction.item.category.name,
      quantity: Math.abs(transaction.quantity),
      unit: transaction.item.unit,
      performedBy: `${transaction.user.firstName} ${transaction.user.lastName}`,
      role: transaction.user.role,
      requisitionId: transaction.requisitionId,
      requisitionTitle: transaction.requisition?.title,
      notes: transaction.notes,
    }));

    if (format === "csv") {
      try {
        const parser = new Parser();
        const csv = parser.parse(reportData);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=transactions-${
            new Date().toISOString().split("T")[0]
          }.csv`
        );
        res.send(csv);
      } catch (csvError) {
        console.error("CSV conversion error:", csvError);
        res.status(500).json({ error: "Failed to generate CSV report" });
      }
    } else {
      res.json({
        generatedAt: new Date().toISOString(),
        totalTransactions: reportData.length,
        dateRange: {
          start: startDate || "all time",
          end: endDate || "all time",
        },
        data: reportData,
      });
    }
  } catch (error) {
    console.error("Generate transaction report error:", error);
    res.status(500).json({ error: "Failed to generate transaction report" });
  }
};

// Generate requisition activity report
export const generateRequisitionReport = async (req, res) => {
  const {
    format = "json",
    startDate,
    endDate,
    status,
    departmentId,
  } = req.query;

  try {
    let whereClause = {};

    // Date filter
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = new Date(startDate);
      if (endDate) whereClause.createdAt.lte = new Date(endDate);
    }

    // Status filter
    if (status) {
      whereClause.status = status;
    }

    // Department filter
    if (departmentId) {
      whereClause.departmentId = parseInt(departmentId);
    }

    const requisitions = await prisma.requisition.findMany({
      where: whereClause,
      include: {
        department: {
          select: {
            name: true,
          },
        },
        createdBy: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        processedBy: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        items: {
          include: {
            item: {
              select: {
                name: true,
                unit: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const reportData = requisitions.map((req) => ({
      id: req.id,
      title: req.title,
      description: req.description,
      status: req.status,
      department: req.department.name,
      createdBy: `${req.createdBy.firstName} ${req.createdBy.lastName}`,
      createdAt: req.createdAt,
      processedBy: req.processedBy
        ? `${req.processedBy.firstName} ${req.processedBy.lastName}`
        : null,
      processedAt: req.processedAt,
      reasonForRejection: req.reasonForRejection,
      totalItems: req.items.length,
      items: req.items.map((item) => ({
        name: item.item.name,
        quantity: item.quantity,
        unit: item.item.unit,
      })),
    }));

    if (format === "csv") {
      try {
        // Flatten data for CSV
        const flattenedData = reportData.flatMap((req) =>
          req.items.map((item) => ({
            requisitionId: req.id,
            requisitionTitle: req.title,
            status: req.status,
            department: req.department,
            createdBy: req.createdBy,
            createdAt: req.createdAt,
            itemName: item.name,
            itemQuantity: item.quantity,
            itemUnit: item.unit,
          }))
        );

        const parser = new Parser();
        const csv = parser.parse(flattenedData);

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=requisitions-${
            new Date().toISOString().split("T")[0]
          }.csv`
        );
        res.send(csv);
      } catch (csvError) {
        console.error("CSV conversion error:", csvError);
        res.status(500).json({ error: "Failed to generate CSV report" });
      }
    } else {
      res.json({
        generatedAt: new Date().toISOString(),
        totalRequisitions: reportData.length,
        byStatus: reportData.reduce((acc, req) => {
          acc[req.status] = (acc[req.status] || 0) + 1;
          return acc;
        }, {}),
        dateRange: {
          start: startDate || "all time",
          end: endDate || "all time",
        },
        data: reportData,
      });
    }
  } catch (error) {
    console.error("Generate requisition report error:", error);
    res.status(500).json({ error: "Failed to generate requisition report" });
  }
};

// Generate audit trail report
export const generateAuditReport = async (req, res) => {
  const { format = "json", startDate, endDate, userId } = req.query;

  try {
    let whereClause = {};

    // Date filter
    if (startDate || endDate) {
      whereClause.createdAt = {};
      if (startDate) whereClause.createdAt.gte = new Date(startDate);
      if (endDate) whereClause.createdAt.lte = new Date(endDate);
    }

    // User filter
    if (userId) {
      whereClause.OR = [
        { createdById: parseInt(userId) },
        { processedById: parseInt(userId) },
      ];
    }

    // Get combined audit data from multiple sources
    const [requisitions, serviceRequests, transactions] = await Promise.all([
      prisma.requisition.findMany({
        where: whereClause,
        include: {
          department: { select: { name: true } },
          createdBy: {
            select: { firstName: true, lastName: true, role: true },
          },
          processedBy: { select: { firstName: true, lastName: true } },
          items: {
            include: {
              item: { select: { name: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.serviceRequest.findMany({
        where: whereClause,
        include: {
          department: { select: { name: true } },
          createdBy: {
            select: { firstName: true, lastName: true, role: true },
          },
          processedBy: { select: { firstName: true, lastName: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.transaction.findMany({
        where: whereClause,
        include: {
          item: { select: { name: true } },
          user: { select: { firstName: true, lastName: true, role: true } },
          requisition: { select: { title: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    // Combine all audit data
    const auditData = [
      ...requisitions.map((req) => ({
        type: "REQUISITION",
        id: req.id,
        action: req.status === "PENDING" ? "CREATE" : req.status,
        description: `Requisition: ${req.title}`,
        user: req.processedBy
          ? `${req.processedBy.firstName} ${req.processedBy.lastName}`
          : `${req.createdBy.firstName} ${req.createdBy.lastName}`,
        userRole: req.createdBy.role,
        timestamp: req.processedAt || req.createdAt,
        details: {
          department: req.department.name,
          status: req.status,
          items: req.items.length,
          reason: req.reasonForRejection,
        },
      })),
      ...serviceRequests.map((sr) => ({
        type: "SERVICE_REQUEST",
        id: sr.id,
        action: sr.status === "PENDING" ? "CREATE" : sr.status,
        description: `Service Request: ${sr.title}`,
        user: sr.processedBy
          ? `${sr.processedBy.firstName} ${sr.processedBy.lastName}`
          : `${sr.createdBy.firstName} ${sr.createdBy.lastName}`,
        userRole: sr.createdBy.role,
        timestamp: sr.processedAt || sr.createdAt,
        details: {
          department: sr.department.name,
          status: sr.status,
          reason: sr.reasonForRejection,
        },
      })),
      ...transactions.map((trans) => ({
        type: "TRANSACTION",
        id: trans.id,
        action: trans.type,
        description: `Transaction: ${trans.item.name} (${Math.abs(
          trans.quantity
        )} ${trans.item.unit})`,
        user: `${trans.user.firstName} ${trans.user.lastName}`,
        userRole: trans.user.role,
        timestamp: trans.createdAt,
        details: {
          requisition: trans.requisition?.title,
          notes: trans.notes,
        },
      })),
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    if (format === "csv") {
      try {
        const parser = new Parser();
        const csv = parser.parse(
          auditData.map((item) => ({
            type: item.type,
            id: item.id,
            action: item.action,
            description: item.description,
            user: item.user,
            userRole: item.userRole,
            timestamp: item.timestamp,
            details: JSON.stringify(item.details),
          }))
        );

        res.setHeader("Content-Type", "text/csv");
        res.setHeader(
          "Content-Disposition",
          `attachment; filename=audit-trail-${
            new Date().toISOString().split("T")[0]
          }.csv`
        );
        res.send(csv);
      } catch (csvError) {
        console.error("CSV conversion error:", csvError);
        res.status(500).json({ error: "Failed to generate CSV report" });
      }
    } else {
      res.json({
        generatedAt: new Date().toISOString(),
        totalRecords: auditData.length,
        dateRange: {
          start: startDate || "all time",
          end: endDate || "all time",
        },
        data: auditData,
      });
    }
  } catch (error) {
    console.error("Generate audit report error:", error);
    res.status(500).json({ error: "Failed to generate audit report" });
  }
};
