import prisma from "../lib/prisma.js";
import { notificationTriggers } from "../services/notifications.service.js";

export const createServiceRequest = async (req, res) => {
  const { title, description } = req.body;

  try {
    const serviceRequest = await prisma.serviceRequest.create({
      data: {
        title,
        description,
        createdById: req.user.id,
        departmentId: req.user.departmentId,
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json(serviceRequest);
  } catch (error) {
    console.error("Create service request error:", error);
    res.status(500).json({ error: "Failed to create service request" });
  }
};

export const getServiceRequests = async (req, res) => {
  const { status, departmentId } = req.query;

  try {
    let whereClause = {};

    if (req.user.role === "DEPARTMENT_HEAD") {
      whereClause.departmentId = req.user.departmentId;
    } else if (req.user.role === "PROCUREMENT_OFFICER") {
    } else if (req.user.role === "STOREKEEPER") {
    } else if (req.user.role === "ADMIN") {
    }

    if (status) {
      whereClause.status = status;
    }

    if (
      departmentId &&
      (req.user.role === "PROCUREMENT_OFFICER" || req.user.role === "ADMIN")
    ) {
      whereClause.departmentId = parseInt(departmentId);
    }

    const serviceRequests = await prisma.serviceRequest.findMany({
      where: whereClause,
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        processedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(serviceRequests);
  } catch (error) {
    console.error("Get service requests error:", error);
    res.status(500).json({ error: "Failed to fetch service requests" });
  }
};

export const getServiceRequestById = async (req, res) => {
  const { id } = req.params;

  if (isNaN(parseInt(id))) {
    return res.status(400).json({ error: "Invalid service request ID" });
  }

  try {
    const serviceRequest = await prisma.serviceRequest.findUnique({
      where: { id: parseInt(id) },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        processedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!serviceRequest) {
      return res.status(404).json({ error: "Service request not found" });
    }

    if (
      req.user.role === "DEPARTMENT_HEAD" &&
      serviceRequest.departmentId !== req.user.departmentId
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(serviceRequest);
  } catch (error) {
    console.error("Get service request error:", error);
    res.status(500).json({ error: "Failed to fetch service request" });
  }
};

export const updateServiceRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { status, reasonForRejection } = req.body;

  try {
    if (!["APPROVED", "REJECTED"].includes(status)) {
      return res
        .status(400)
        .json({ error: "Status must be APPROVED or REJECTED" });
    }

    const existingServiceRequest = await prisma.serviceRequest.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingServiceRequest) {
      return res.status(404).json({ error: "Service request not found" });
    }

    if (existingServiceRequest.status !== "PENDING") {
      return res.status(400).json({
        error: `Service request is already ${existingServiceRequest.status.toLowerCase()}`,
      });
    }

    if (status === "REJECTED" && !reasonForRejection) {
      return res
        .status(400)
        .json({ error: "Reason for rejection is required" });
    }

    const updatedServiceRequest = await prisma.serviceRequest.update({
      where: { id: parseInt(id) },
      data: {
        status,
        reasonForRejection: status === "REJECTED" ? reasonForRejection : null,
        processedById: req.user.id,
        processedAt: new Date(),
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        processedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
    await notificationTriggers.onServiceRequestStatusChange(
      updatedServiceRequest
    );

    res.json({
      message: `Service request ${status.toLowerCase()} successfully`,
      serviceRequest: updatedServiceRequest,
    });
  } catch (error) {
    console.error("Update service request status error:", error);
    res.status(500).json({ error: "Failed to update service request status" });
  }
};

export const getServiceRequestStats = async (req, res) => {
  try {
    let whereClause = {};

    if (req.user.role === "DEPARTMENT_HEAD") {
      whereClause.departmentId = req.user.departmentId;
    }

    const stats = await prisma.serviceRequest.groupBy({
      by: ["status"],
      where: whereClause,
      _count: {
        id: true,
      },
    });

    const formattedStats = {
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
      total: 0,
    };

    stats.forEach((stat) => {
      formattedStats[stat.status] = stat._count.id;
      formattedStats.total += stat._count.id;
    });

    res.json(formattedStats);
  } catch (error) {
    console.error("Get service request stats error:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch service request statistics" });
  }
};
