import { defineRouteConfig } from "@medusajs/admin-sdk";
import { TagSolid } from "@medusajs/icons";
import { Container, Table, Heading, Text } from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";
import { sdk } from "../lib/sdk";
import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import Spinner from "./spinner";

type DataTablePaginationState = {
  pageSize: number;
  pageIndex: number;
};

type Brand = {
  id: string;
  name: string;
};
type BrandsResponse = {
  brands: Brand[];
  count: number;
  limit: number;
  offset: number;
};

const BrandsPage = () => {
  const limit = 15;
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: limit,
    pageIndex: 0,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const offset = useMemo(() => {
    return pagination.pageIndex * limit;
  }, [pagination]);

  const { data, isLoading } = useQuery<BrandsResponse>({
    queryFn: () =>
      sdk.client.fetch(`/admin/brands`, {
        query: {
          limit,
          offset,
        },
      }),
    queryKey: [["brands", limit, offset]],
  });

  const columnHelper = createColumnHelper<Brand>();
  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => <Text>{info.getValue()}</Text>,
    }),
    columnHelper.accessor("id", {
      header: "ID",
      cell: (info) => (
        <Text className="text-ui-fg-subtle">{info.getValue()}</Text>
      ),
    }),
  ];

  const table = useReactTable({
    data: data?.brands ?? [],
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (isLoading) {
    return (
      <Container className="flex items-center justify-center h-full">
        <Spinner size="large" />
      </Container>
    );
  }

  return (
    <Container className="p-0">
      <div className="flex items-center justify-between px-8 py-4">
        <Heading>Brands</Heading>
      </div>
      <Table>
        <Table.Header>
          {table.getHeaderGroups().map((headerGroup) => (
            <Table.Row key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <Table.HeaderCell
                  key={header.id}
                  className="cursor-pointer"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                  <span className="ml-2">
                    {{
                      asc: "↑",
                      desc: "↓",
                    }[header.column.getIsSorted() as string] ?? null}
                  </span>
                </Table.HeaderCell>
              ))}
            </Table.Row>
          ))}
        </Table.Header>
        <Table.Body>
          {table.getRowModel().rows.map((row) => (
            <Table.Row key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <Table.Cell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Text className="text-ui-fg-subtle">
            {data?.count ?? 0} {data?.count === 1 ? "brand" : "brands"}
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: Math.max(0, prev.pageIndex - 1),
              }))
            }
            disabled={pagination.pageIndex === 0}
            className="text-ui-fg-subtle hover:text-ui-fg-base disabled:opacity-50"
          >
            Previous
          </button>
          <Text className="text-ui-fg-subtle">
            Page {pagination.pageIndex + 1}
          </Text>
          <button
            onClick={() =>
              setPagination((prev) => ({
                ...prev,
                pageIndex: prev.pageIndex + 1,
              }))
            }
            disabled={!data || data.brands.length < limit}
            className="text-ui-fg-subtle hover:text-ui-fg-base disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Brands",
  icon: TagSolid,
});

export default BrandsPage;
