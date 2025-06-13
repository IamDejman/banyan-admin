'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useClaimsStore } from '@/lib/store/claims-store';
import { useAuthStore } from '@/lib/store/auth-store';
import { ReviewOutcome } from '@/lib/types/claims';

const reviewSchema = z.object({
  outcome: z.enum(['APPROVED', 'REJECTED', 'NEEDS_INFO'] as const),
  notes: z.string().min(10, 'Review notes must be at least 10 characters'),
  additionalInfo: z.string().optional(),
  deadline: z.string().optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ClaimReviewFormProps {
  claimId: string;
  onSuccess?: () => void;
}

export function ClaimReviewForm({ claimId, onSuccess }: ClaimReviewFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitClaimReview } = useClaimsStore();
  const { user } = useAuthStore();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      outcome: 'APPROVED',
    },
  });

  const selectedOutcome = watch('outcome');

  const onSubmit = async (data: ReviewFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      await submitClaimReview({
        claimId,
        reviewerId: user.id,
        reviewerName: user.name,
        outcome: data.outcome as ReviewOutcome,
        notes: data.notes,
      });
      onSuccess?.();
    } catch (error) {
      console.error('Failed to submit review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Review Outcome
        </label>
        <div className="grid grid-cols-3 gap-4">
          <label className="relative">
            <input
              type="radio"
              value="APPROVED"
              {...register('outcome')}
              className="peer sr-only"
            />
            <div className="flex items-center justify-center p-4 border rounded-lg cursor-pointer peer-checked:border-primary peer-checked:bg-primary/5">
              <span className="text-sm font-medium">Approve</span>
            </div>
          </label>
          <label className="relative">
            <input
              type="radio"
              value="REJECTED"
              {...register('outcome')}
              className="peer sr-only"
            />
            <div className="flex items-center justify-center p-4 border rounded-lg cursor-pointer peer-checked:border-primary peer-checked:bg-primary/5">
              <span className="text-sm font-medium">Reject</span>
            </div>
          </label>
          <label className="relative">
            <input
              type="radio"
              value="NEEDS_INFO"
              {...register('outcome')}
              className="peer sr-only"
            />
            <div className="flex items-center justify-center p-4 border rounded-lg cursor-pointer peer-checked:border-primary peer-checked:bg-primary/5">
              <span className="text-sm font-medium">Needs Info</span>
            </div>
          </label>
        </div>
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Review Notes
        </label>
        <textarea
          id="notes"
          rows={4}
          {...register('notes')}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Enter your review notes here..."
        />
        {errors.notes && (
          <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
        )}
      </div>

      {selectedOutcome === 'NEEDS_INFO' && (
        <>
          <div>
            <label
              htmlFor="additionalInfo"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Required Information
            </label>
            <textarea
              id="additionalInfo"
              rows={3}
              {...register('additionalInfo')}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Specify what additional information is needed..."
            />
          </div>

          <div>
            <label
              htmlFor="deadline"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Response Deadline
            </label>
            <input
              type="date"
              id="deadline"
              {...register('deadline')}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
} 