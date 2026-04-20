"use client";

import { useState } from "react";
import { 
  NewsletterSubscriber, 
  deleteNewsletterSubscriber, 
  updateSubscriberStatus 
} from "@/actions/newsletter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Trash2, UserX, UserCheck, Mail, Calendar, AlertTriangle, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import React, { useMemo } from "react";

interface NewsletterTableProps {
  initialSubscribers: NewsletterSubscriber[];
}

export function NewsletterTable({ initialSubscribers }: NewsletterTableProps) {
  const [subscribers, setSubscribers] = useState(initialSubscribers);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState<NewsletterSubscriber | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const totalPages = Math.ceil(subscribers.length / ITEMS_PER_PAGE);
  const paginatedSubscribers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return subscribers.slice(start, start + ITEMS_PER_PAGE);
  }, [subscribers, currentPage]);

  async function handleDelete() {
    if (!subscriberToDelete) return;

    setIsDeleting(true);
    try {
      const result = await deleteNewsletterSubscriber(subscriberToDelete.id);
      if (result.success) {
        setSubscribers(subscribers.filter(s => s.id !== subscriberToDelete.id));
        if (paginatedSubscribers.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
        toast.success("Subscriber deleted successfully");
        setIsDeleteDialogOpen(false);
      } else {
        toast.error(result.error || "Failed to delete subscriber");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsDeleting(false);
    }
  }

  function openDeleteDialog(subscriber: NewsletterSubscriber) {
    setSubscriberToDelete(subscriber);
    setIsDeleteDialogOpen(true);
  }

  async function handleStatusUpdate(id: string, currentStatus: "active" | "unsubscribed") {
    const newStatus = currentStatus === "active" ? "unsubscribed" : "active";
    const result = await updateSubscriberStatus(id, newStatus);
    
    if (result.success) {
      setSubscribers(subscribers.map(s => 
        s.id === id ? { ...s, status: newStatus } : s
      ));
      toast.success(`Subscriber marked as ${newStatus}`);
    } else {
      toast.error(result.error || "Failed to update status");
    }
  }

  return (
    <div className="w-full">
      <div className="overflow-x-auto scroller">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-50 dark:border-slate-800 hover:bg-transparent">
              <TableHead className="w-[300px] py-6 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400">Subscriber</TableHead>
              <TableHead className="py-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</TableHead>
              <TableHead className="py-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hidden sm:table-cell">Subscribed On</TableHead>
              <TableHead className="text-right py-6 px-10 text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscribers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-slate-400 font-medium italic">
                  No subscribers found.
                </TableCell>
              </TableRow>
            ) : (
              paginatedSubscribers.map((subscriber) => (
                <TableRow key={subscriber.id} className="border-slate-50 dark:border-slate-800 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors group">
                  <TableCell className="py-6 px-10">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-[15px] text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                        {subscriber.name || "Anonymous Subscriber"}
                      </span>
                      <span className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5 uppercase tracking-tight">
                        <Mail className="w-3 h-3 text-slate-300" />
                        {subscriber.email}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="py-6">
                    <Badge 
                      variant={subscriber.status === 'active' ? 'default' : 'secondary'}
                      className={
                        subscriber.status === 'active' 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-lg capitalize flex items-center w-fit gap-1.5 text-[10px] font-black shadow-sm"
                          : "bg-slate-50 text-slate-500 border border-slate-100 px-3 py-1 rounded-lg capitalize flex items-center w-fit gap-1.5 text-[10px] font-black"
                      }
                    >
                      {subscriber.status === 'active' ? (
                        <UserCheck className="w-3 h-3" />
                      ) : (
                        <UserX className="w-3 h-3" />
                      )}
                      {subscriber.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-6 hidden sm:table-cell">
                    <span className="text-[12px] text-slate-500 font-bold flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-300" />
                      {format(new Date(subscriber.created_at), "MMM d, yyyy")}
                    </span>
                  </TableCell>
                  <TableCell className="text-right py-6 px-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-10 w-10 p-0 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all active:scale-90">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-5 w-5 text-slate-400" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl shadow-2xl border-slate-100">
                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-3 py-2">Quick Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-slate-50" />
                        <DropdownMenuItem 
                          onClick={() => handleStatusUpdate(subscriber.id, subscriber.status)}
                          className="flex items-center gap-3 cursor-pointer py-3 px-3 rounded-xl focus:bg-slate-50 transition-colors font-bold text-[13px]"
                        >
                          {subscriber.status === 'active' ? (
                            <>
                              <UserX className="w-4 h-4 text-slate-400" />
                              <span>Suspend Subscription</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-4 h-4 text-emerald-500" />
                              <span>Reactivate Subscriber</span>
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => openDeleteDialog(subscriber)}
                          className="text-rose-600 focus:text-rose-700 focus:bg-rose-50 flex items-center gap-3 cursor-pointer py-3 px-3 rounded-xl transition-colors font-bold text-[13px]"
                        >
                          <Trash2 className="w-4 h-4 text-rose-400" />
                          <span>Permanent Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Footer */}
      {subscribers.length > 0 && (
          <div className="px-6 sm:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-50 bg-slate-50/20">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="bg-white px-2.5 py-1 rounded-lg border border-slate-100 shadow-sm text-slate-900 leading-none">
                    {Math.min(subscribers.length, (currentPage - 1) * ITEMS_PER_PAGE + 1)}—{Math.min(subscribers.length, currentPage * ITEMS_PER_PAGE)}
                </span>
                OF {subscribers.length} MEMBERS
              </div>

              {totalPages > 1 && (
                  <div className="flex items-center gap-2">
                      <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                          disabled={currentPage === 1}
                          className="h-10 w-10 p-0 rounded-xl shadow-sm border-slate-200 hover:bg-white active:scale-90 transition-all"
                      >
                          <ChevronLeft size={18} />
                      </Button>

                      <div className="flex items-center gap-1.5 mx-1 overflow-x-auto no-scrollbar max-w-[140px] xs:max-w-none px-1">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                              const isVisible = totalPages <= 5 || 
                                  page === 1 || 
                                  page === totalPages || 
                                  (page >= currentPage - 1 && page <= currentPage + 1);
                              
                              if (!isVisible) {
                                  if (page === 2 || page === totalPages - 1) {
                                      return <span key={page} className="text-slate-300 mx-0.5">.</span>;
                                  }
                                  return null;
                              }

                              return (
                                  <button
                                      key={page}
                                      onClick={() => setCurrentPage(page)}
                                      className={`min-w-[36px] h-10 px-3 text-[11px] font-black rounded-xl transition-all shadow-sm ${
                                          currentPage === page 
                                              ? "bg-slate-900 text-white shadow-slate-200 border-transparent" 
                                              : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
                                      }`}
                                  >
                                      {page}
                                  </button>
                              );
                          })}
                      </div>

                      <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                          disabled={currentPage === totalPages}
                          className="h-10 w-10 p-0 rounded-xl shadow-sm border-slate-200 hover:bg-white active:scale-90 transition-all"
                      >
                          <ChevronRight size={18} />
                      </Button>
                  </div>
              )}
          </div>
      )}

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] border-none shadow-2xl bg-white dark:bg-slate-900">
          <DialogHeader className="pt-4 px-2">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-500" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">Delete Subscriber</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400 pt-1">
              Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-slate-100">{subscriberToDelete?.email}</span>? 
              This action cannot be undone and they will no longer receive any newsletters.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="bg-slate-50 dark:bg-slate-950/50 mt-4 -mx-6 -mb-6 p-6 gap-3">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="rounded-xl border-slate-200 border dark:border-slate-800"
              disabled={isDeleting}
            >
              No, keep them
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="rounded-xl bg-red-600 hover:bg-red-700 text-white min-w-[120px]"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Yes, delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
