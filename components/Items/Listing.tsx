'use client';

import {useState} from 'react';
import type {ColumnDef, ColumnFiltersState, SortingState} from '@tanstack/react-table';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table';
import {ArrowUpDown} from 'lucide-react';
import type {FC} from 'react';

import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {useItems} from '@/src/features/items';

export type Item = {
    id: number;
    name: string;
    category: 'Category A' | 'Category B' | 'success' | 'failed';
    price: number;
};

export const columns: ColumnDef<Item>[] = [
    {
        accessorKey: 'name',
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Name
                    <ArrowUpDown className="ml-2 size-4" />
                </Button>
            );
        },
        cell: ({row}) => <div className="pl-4 capitalize">{row.getValue('name')}</div>,
    },
    {
        accessorKey: 'category',
        header: ({column}) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Category
                    <ArrowUpDown className="ml-2 size-4" />
                </Button>
            );
        },
        cell: ({row}) => (
            <div className="pl-4  lowercase">{row.getValue('category')}</div>
        ),
    },
    {
        accessorKey: 'price',
        header: ({column}) => (
            <div className="text-right">
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
                    Price
                    <ArrowUpDown className="ml-2 size-4" />
                </Button>
            </div>
        ),
        cell: ({row}) => {
            const amount = parseFloat(row.getValue('price'));

            // Format the amount as a dollar amount
            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(amount);

            return <div className="text-right font-medium">{formatted}</div>;
        },
    },
];

export const Listing: FC<{data?: Item[]}> = ({data: dataProp = []}) => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const table = useReactTable({
        data: dataProp,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    });

    const {refetch} = useItems();

    return (
        <div className="w-full">
            <div className="flex items-center gap-3 py-4">
                <Button
                    variant="outline"
                    onClick={() => {
                        refetch();
                    }}>
                    Refetch data
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Show:{' '}
                            {(table.getColumn('category')?.getFilterValue() as string) ??
                                'All'}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center">
                        <DropdownMenuItem
                            onClick={() => {
                                table.getColumn('category')?.setFilterValue('');
                            }}>
                            All items
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                table.getColumn('category')?.setFilterValue('Category A');
                            }}>
                            Category A
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                table.getColumn('category')?.setFilterValue('Category B');
                            }}>
                            Category B
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Input
                    placeholder="Search products by name"
                    value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
                    onChange={event =>
                        table.getColumn('name')?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map(headerGroup => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef.header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map(row => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map(cell => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};
