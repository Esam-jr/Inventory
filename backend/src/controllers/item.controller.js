import prisma from "../lib/prisma.js";

export const getItems = async (req, res) => {
  try {
    const items = await prisma.item.findMany({
      include: {
        category: true,
        transactions: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
      orderBy: { name: "asc" },
    });
    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
};
export const createItem = async (req, res) => {
  // Add authorization check here later
  const { name, description, quantity, minQuantity, unit, categoryId } =
    req.body;

  try {
    const newItem = await prisma.item.create({
      data: {
        name,
        description,
        quantity,
        minQuantity,
        unit,
        categoryId: parseInt(categoryId),
      },
    });
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ error: "Failed to create item" });
  }
};
