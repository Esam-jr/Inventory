import prisma from "../lib/prisma.js";

export const getDepartments = async (req, res) => {
  try {
    const departments = await prisma.department.findMany({
      include: {
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(departments);
  } catch (error) {
    res.status(500).json({ error, message: "Failed to fetch departments" });
  }
};

export const createDepartment = async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({ error: "All fiels are requered." });
  }
  const department = await prisma.department.findUnique({
    where: { name },
  });
  if (department) {
    return res.status(400).json({ error: "Department already exists." });
  }
  try {
    const newDepartment = await prisma.department.create({
      data: {
        name,
        description,
      },
    });
    res.status(201).json(newDepartment);
  } catch (error) {
    res.status(500).json({ error: "Failed to create department" });
  }
};

export const deleteDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.department.delete({
      where: { id: parseInt(id, 10) },
    });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete department" });
  }
};
