"use client";

import { useEffect, useState } from "react";
import {
  CheckIcon,
  ClockIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { Badge } from "@/components/tailgrids/core/badge";
import { Button } from "@/components/tailgrids/core/button";
import { Card, CardContent } from "@/components/tailgrids/core/card";
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/tailgrids/core/dialog";
import { Backdrop } from "@/components/tailgrids/core/overlay";
import { Spinner } from "@/components/tailgrids/core/spinner";
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from "@/components/tailgrids/core/table";
import { cn } from "@/utils/cn";

type Todo = {
  id: number;
  title: string;
  status: "waiting" | "done";
};

const PAGE_SIZE_OPTIONS = [5, 10, 15, 20] as const;

const statusWaitingClass =
  "bg-amber-400 text-amber-950 [&>svg]:text-amber-950 text-sm px-3 py-1 gap-1.5 [&>svg]:size-4";
const statusDoneClass =
  "bg-emerald-600 text-white [&>svg]:text-white text-sm px-3 py-1 gap-1.5 [&>svg]:size-4";
const pageBtnClass =
  "border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 focus:ring-blue-200";

async function fetchTodos(): Promise<Todo[]> {
  const res = await fetch(
    "https://jsonplaceholder.typicode.com/todos?_limit=13",
  );
  if (!res.ok) throw new Error("Failed to fetch todos");
  const data: { id: number; title: string; completed: boolean }[] =
    await res.json();
  return data.map((todo) => ({
    id: todo.id,
    title: todo.title,
    status: todo.completed ? "done" : "waiting",
  }));
}

export default function Todos() {
  const [todosRaw, setTodosRaw] = useState<Todo[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [onlyWaiting, setOnlyWaiting] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [numPages, setNumPages] = useState(0);
  const [curPage, setCurPage] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // fetch -> todosRaw
  useEffect(() => {
    setIsLoading(true);
    fetchTodos()
      .then(setTodosRaw)
      .finally(() => setIsLoading(false));
  }, []);

  // todosRaw, onlyWaiting -> todos
  useEffect(() => {
    const selectedItems = todosRaw.filter(
      (todo) => !onlyWaiting || todo.status === "waiting",
    );
    setTodos(selectedItems);
  }, [todosRaw, onlyWaiting]);

  // todos, itemsPerPage -> numPages
  useEffect(() => {
    setNumPages(Math.ceil(todos.length / itemsPerPage));
  }, [todos, itemsPerPage]);

  // numPages -> curPage
  useEffect(() => {
    if (numPages === 0) setCurPage(0);
    else if (curPage === 0) setCurPage(1);
    else if (curPage > numPages) setCurPage(numPages);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- diagram: numPages -> curPage
  }, [numPages]);

  const deleteClick = (id: number) => {
    setTodosRaw(
      todosRaw.filter((todo) => {
        return todo.id !== id;
      }),
    );
  };

  const waitingClick = (id: number) => {
    const selectedItem = todosRaw.find((todo) => {
      return todo.id === id;
    });
    if (!selectedItem) return;
    selectedItem.status = "done";
    setTodosRaw([...todosRaw]); // force update
  };

  const openAddModal = () => {
    setNewTitle("");
    setIsAdding(true);
  };

  const closeAddModal = () => {
    setIsAdding(false);
    setNewTitle("");
  };

  const nextId =
    todosRaw.reduce((max, todo) => Math.max(max, todo.id), 0) + 1;

  const submitNewTodo = () => {
    const title = newTitle.trim();
    if (!title) return;
    const nextTodos = [
      ...todosRaw,
      {
        id: nextId,
        title,
        status: "waiting" as const,
      },
    ];
    setTodosRaw(nextTodos);
    closeAddModal();
    const filteredCount = nextTodos.filter(
      (todo) => !onlyWaiting || todo.status === "waiting",
    ).length;
    setCurPage(Math.max(1, Math.ceil(filteredCount / itemsPerPage)));
  };

  const start = curPage > 0 ? (curPage - 1) * itemsPerPage : 0;
  const pageItems = todos.slice(start, start + itemsPerPage);

  return (
    <>
      <Card className="border border-base-100 shadow-md w-full overflow-hidden">
        <CardContent className="py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex items-center gap-2.5 select-none">
              <button
                type="button"
                role="switch"
                aria-checked={onlyWaiting}
                aria-label="Show only waiting"
                onClick={() => setOnlyWaiting((v) => !v)}
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full transition cursor-pointer",
                  onlyWaiting
                    ? "bg-toggle-active-background"
                    : "bg-toggle-default-background",
                )}
              >
                <span
                  className={cn(
                    "absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow-sm transition",
                    onlyWaiting && "translate-x-5",
                  )}
                />
              </button>
              <button
                type="button"
                onClick={() => setOnlyWaiting((v) => !v)}
                className="inline-flex items-center gap-2 cursor-pointer"
              >
                <span className="text-sm text-text-100">Show only</span>
                <Badge
                  color="warning"
                  size="md"
                  className={statusWaitingClass}
                  prefixIcon={<ClockIcon />}
                >
                  waiting
                </Badge>
              </button>
            </div>

            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurPage(1);
              }}
              className="rounded-lg border border-base-200 bg-input-background px-3 py-2 text-sm text-title-50 shadow-xs focus:border-input-primary-focus-border focus:outline-none focus:ring-2 focus:ring-primary-200"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>
                  {n} items per page
                </option>
              ))}
            </select>
          </div>

          <TableRoot className="w-full text-sm">
            <TableHeader className="bg-zinc-800 text-white [&_th]:border-zinc-800 [&_th]:text-sm [&_th]:text-white">
              <TableRow>
                <TableHead className="w-20 font-semibold">ID</TableHead>
                <TableHead className="font-semibold">Title</TableHead>
                <TableHead className="w-60 font-semibold">
                  <div className="flex items-center justify-between gap-2">
                    <span>Status</span>
                    <Button
                      variant="primary"
                      appearance="fill"
                      iconOnly
                      size="xs"
                      className="rounded-md"
                      aria-label="Add todo"
                      onPress={openAddModal}
                    >
                      <PlusIcon className="size-4" />
                    </Button>
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-14">
                    <div className="flex flex-col items-center justify-center gap-3 text-text-100">
                      <Spinner size="lg" type="default" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : pageItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-10 text-center">
                    ไม่มีรายการ
                  </TableCell>
                </TableRow>
              ) : (
                pageItems.map((todo, index) => (
                  <TableRow
                    key={todo.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-zinc-50"}
                  >
                    <TableCell>
                      <span className="inline-flex size-7 items-center justify-center rounded-full bg-zinc-700 text-xs font-semibold text-white">
                        {todo.id}
                      </span>
                    </TableCell>
                    <TableCell className="text-title-50">
                      {todo.title}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        {todo.status === "done" ? (
                          <Badge
                            color="success"
                            size="md"
                            className={statusDoneClass}
                            prefixIcon={<CheckIcon />}
                          >
                            done
                          </Badge>
                        ) : (
                          <button
                            type="button"
                            onClick={() => waitingClick(todo.id)}
                            className="cursor-pointer"
                            aria-label={`Mark "${todo.title}" as done`}
                          >
                            <Badge
                              color="warning"
                              size="md"
                              className={statusWaitingClass}
                              prefixIcon={<ClockIcon />}
                            >
                              waiting
                            </Badge>
                          </button>
                        )}
                        <Button
                          variant="danger"
                          appearance="fill"
                          iconOnly
                          size="xs"
                          className="rounded-md"
                          aria-label={`Delete "${todo.title}"`}
                          onPress={() => deleteClick(todo.id)}
                        >
                          <TrashIcon className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </TableRoot>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            <Button
              variant="primary"
              appearance="outline"
              size="sm"
              className={pageBtnClass}
              disabled={curPage <= 1}
              onPress={() => setCurPage(1)}
            >
              First
            </Button>
            <Button
              variant="primary"
              appearance="outline"
              size="sm"
              className={pageBtnClass}
              disabled={curPage <= 1}
              onPress={() => setCurPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>

            <span className="min-w-14 px-2 text-center text-sm font-semibold tabular-nums text-blue-600">
              {curPage} / {numPages || 0}
            </span>

            <Button
              variant="primary"
              appearance="outline"
              size="sm"
              className={pageBtnClass}
              disabled={curPage === 0 || curPage >= numPages}
              onPress={() => setCurPage((p) => Math.min(numPages, p + 1))}
            >
              Next
            </Button>
            <Button
              variant="primary"
              appearance="outline"
              size="sm"
              className={pageBtnClass}
              disabled={curPage === 0 || curPage >= numPages}
              onPress={() => setCurPage(numPages)}
            >
              Last
            </Button>
          </div>
        </CardContent>
      </Card>

      <Backdrop
        isOpen={isAdding}
        onOpenChange={(open) => {
          if (!open) closeAddModal();
          else setIsAdding(true);
        }}
      >
        <Dialog className="max-w-md z-50">
          {({ close }) => (
            <>
              <DialogHeader>
                <DialogTitle>New Todo</DialogTitle>
              </DialogHeader>
              <DialogBody className="flex flex-col gap-4">
                <div>
                  <label
                    htmlFor="todo-id"
                    className="block text-sm font-medium text-input-label-text mb-2"
                  >
                    ID (Auto Generate)
                  </label>
                  <input
                    id="todo-id"
                    type="text"
                    readOnly
                    value={nextId}
                    className="w-full rounded-lg border border-base-200 bg-zinc-50 px-3 py-2.5 text-sm text-text-100 bg-base-200 cursor-not-allowed shadow-xs cursor-default"
                  />
                </div>
                <div>
                  <label
                    htmlFor="todo-title"
                    className="block text-sm font-medium text-input-label-text mb-2"
                  >
                    Title
                  </label>
                  <input
                    id="todo-title"
                    autoFocus
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (!newTitle.trim()) return;
                        submitNewTodo();
                        close();
                      }
                    }}
                    placeholder="เช่น Review pull request"
                    className="w-full rounded-lg border border-base-200 bg-input-background px-3 py-2.5 text-sm text-title-50 shadow-xs focus:border-input-primary-focus-border focus:outline-none focus:ring-2 focus:ring-primary-200"
                  />
                </div>
              </DialogBody>
              <DialogFooter>
                <DialogClose
                  variant="primary"
                  appearance="outline"
                  size="sm"
                  className={pageBtnClass}
                  onPress={closeAddModal}
                >
                  Cancel
                </DialogClose>
                <Button
                  variant="primary"
                  appearance="fill"
                  size="sm"
                  disabled={!newTitle.trim()}
                  onPress={() => {
                    submitNewTodo();
                    close();
                  }}
                >
                  Add
                </Button>
              </DialogFooter>
            </>
          )}
        </Dialog>
      </Backdrop>
    </>
  );
}
