import prisma from "../lib/prisma.js";

// Create a new requisition
export const createRequisition = async (req, res) => {
  const { title, description, items } = req.body;

  try {
    // Verify all items exist
    const itemIds = items.map((item) => item.itemId);
    const existingItems = await prisma.item.findMany({
      where: { id: { in: itemIds } },
      select: { id: true, name: true },
    });

    if (existingItems.length !== items.length) {
      return res.status(400).json({ error: "One or more items not found" });
    }

    // Create the requisition with items
    const requisition = await prisma.requisition.create({
      data: {
        title,
        description,
        createdById: req.user.id,
        departmentId: req.user.departmentId,
        items: {
          create: items.map((item) => ({
            itemId: item.itemId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: {
          include: {
            item: {
              select: {
                id: true,
                name: true,
                description: true,
                unit: true,
              },
            },
          },
        },
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

    res.status(201).json(requisition);
  } catch (error) {
    console.error("Create requisition error:", error);
    res.status(500).json({ error: "Failed to create requisition" });
  }
};

export const getRequisitions = async (req, res) => {
  const { status, departmentId } = req.query;

  try {
    let whereClause = {};

    // Department heads can only see their department's requisitions
    if (req.user.role === "DEPARTMENT_HEAD") {
      whereClause.departmentId = req.user.departmentId;
    }

    // Procurement officers can see all requisitions
    else if (req.user.role === "PROCUREMENT_OFFICER") {
      // No additional filters needed
    }

    // Storekeepers can see all requisitions (for fulfillment)
    else if (req.user.role === "STOREKEEPER") {
      // No additional filters needed
    }

    // Admins can see everything
    else if (req.user.role === "ADMIN") {
      // No additional filters needed
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

    const requisitions = await prisma.requisition.findMany({
      where: whereClause,
      include: {
        items: {
          include: {
            item: {
              select: {
                id: true,
                name: true,
                description: true,
                unit: true,
              },
            },
          },
        },
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

    res.json(requisitions);
  } catch (error) {
    console.error("Get requisitions error:", error);
    res.status(500).json({ error: "Failed to fetch requisitions" });
  }
};

// Get a single requisition by ID
export const getRequisitionById = async (req, res) => {
  const { id } = req.params;

  try {
    const requisition = await prisma.requisition.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          include: {
            item: {
              select: {
                id: true,
                name: true,
                description: true,
                unit: true,
                quantity: true,
              },
            },
          },
        },
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

    if (!requisition) {
      return res.status(404).json({ error: "Requisition not found" });
    }

    if (
      req.user.role === "DEPARTMENT_HEAD" &&
      requisition.departmentId !== req.user.departmentId
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(requisition);
  } catch (error) {
    console.error("Get requisition error:", error);
    res.status(500).json({ error: "Failed to fetch requisition" });
  }
};
