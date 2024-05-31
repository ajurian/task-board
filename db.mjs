import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

(async () => {
    const { id: userId } = await prisma.user.create({
        data: {
            email: "adolfjamesurian@gmail.com",
            displayName: "Adolf James Urian",
        },
        select: { id: true },
    });

    const { id: taskBoardId } = await prisma.taskBoard.create({
        data: {
            ownerId: userId,
            uniqueName: "main",
            displayName: "Main board",
        },
    });

    const ids = await prisma.$transaction(
        [
            {
                taskBoardId,
                order: 0,
                title: "Today",
            },
            {
                taskBoardId,
                order: 1,
                title: "Tomorrow",
            },
            {
                taskBoardId,
                order: 2,
                title: "Rest day",
            },
        ].map((taskListRaw) =>
            prisma.taskList.create({ data: taskListRaw, select: { id: true } })
        )
    );

    await prisma.task.createMany({
        data: [
            {
                taskListId: ids[0].id,
                order: 0,
                title: "Cook lunch",
                details: "5 eggs",
            },
            {
                taskListId: ids[0].id,
                order: 1,
                title: "Clean house",
                details: "30 minutes",
            },
            {
                taskListId: ids[0].id,
                order: 2,
                title: "Rest",
                details: "10 minutes",
            },
            {
                taskListId: ids[0].id,
                order: 3,
                title: "Cook dinner",
                details: "Adobo",
            },
            {
                taskListId: ids[0].id,
                order: 4,
                title: "Sleep",
                details: "8 hours",
            },
            {
                taskListId: ids[1].id,
                order: 0,
                title: "Wake up early",
                details: "7:00 AM",
            },
            {
                taskListId: ids[1].id,
                order: 1,
                title: "Cook breakfast",
                details: "Egg",
            },
            {
                taskListId: ids[1].id,
                order: 2,
                title: "Work",
                details: "6 hours",
            },
            {
                taskListId: ids[2].id,
                order: 0,
                title: "Watch TV",
                details: "2 hours",
            },
            {
                taskListId: ids[2].id,
                order: 1,
                title: "Play games",
                details: "2 hours",
            },
            {
                taskListId: ids[2].id,
                order: 2,
                title: "Cook lunch",
                details: "Hotdog",
            },
        ],
    });
})();

/* import axios from "axios";

try {
    axios.post("http://localhost:3000/api/tasks/reorder", {
        boardUniqueName: "main",
        fromListIndex: 0,
        toListIndex: 1,
        fromIndex: 0,
        toIndex: 0,
    });

    axios.post("http://localhost:3000/api/taskLists/reorder", {
        boardUniqueName: "main",
        fromIndex: 0,
        toIndex: 1,
    });
} catch (e) {} */
