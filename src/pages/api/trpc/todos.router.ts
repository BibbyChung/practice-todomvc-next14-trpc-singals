import { publicProcedure, router } from '~/server/trpc';
import { z } from 'zod';
import { getUUID } from "~/utils/common/util";

export type todoType = {
  id: string;
  title: string;
  completed: boolean;
};

let todos: todoType[] = [
  {
    id: "f33f9cd8-4941-4535-bef9-06200b918541",
    title: "abc",
    completed: false
  }
];

export const todosRouter =
{
  todos: {
    getAll: publicProcedure
      .query(() => todos),
    add: publicProcedure
      .input(z.object({
        id: z.string(),
        title: z.string(),
        completed: z.boolean()
      }))
      .mutation(({ input }) => {
        input.id = getUUID();
        todos.push(input);
      }),
    del: publicProcedure
      .input(z.object({
        id: z.string()
      }))
      .mutation(({ input }) => {
        todos = todos.filter(a => a.id !== input.id);
      }),
    update: publicProcedure
      .input(z.object({
        id: z.string(),
        title: z.string(),
        completed: z.boolean()
      }))
      .mutation(({ input }) => {
        const item = todos.find(a => a.id === input.id);
        if (item) {
          item.completed = input.completed;
          item.title = input.title;
        }
      })
  }
}