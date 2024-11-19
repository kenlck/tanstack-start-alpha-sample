// app/routes/index.tsx
import * as fs from "fs";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";
import { z } from "zod";

const filePath = "count.txt";

async function readCount() {
  return parseInt(await fs.promises.readFile(filePath, "utf-8").catch(() => "0"));
}

const getCount = createServerFn({ method: "GET" }).handler(() => {
  return readCount();
});

const updateCount = createServerFn({ method: "POST" })
  .validator((data: number) => data)
  .handler(async (ctx) => {
    const addBy = ctx.data;
    const count = await readCount();
    await fs.promises.writeFile(filePath, `${count + addBy}`);
    return "OK";
  });

export const Route = createFileRoute("/")({
  component: Home,
  loader: async () => await getCount(),
});

function Home() {
  const router = useRouter();
  const state = Route.useLoaderData();

  return (
    <div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => {
          updateCount({ data: 1 }).then(() => {
            router.invalidate();
          });
        }}
      >
        Add 1 to {state}?
      </button>
      <div className="bg-pink-500 h-24 w-24" />
    </div>
  );
}
