import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useProductReviews,
  useCreateReview,
  useDeleteReview,
} from "../slice/reviewSlice";
import { useCurrentUser } from "../../auth/slice/authSlice";
import { Review } from "../../../types/review.types";
import {
  reviewSchema,
  type ReviewFormData,
} from "../../../validation/reviewSchema";

let toast: any = null;
if (Platform.OS === "web") {
  toast = require("react-hot-toast").default;
}

const showSuccess = (msg: string) => {
  if (Platform.OS === "web" && toast) {
    toast.success(msg);
  } else {
    Alert.alert("Success", msg);
  }
};

const showError = (msg: string) => {
  if (Platform.OS === "web" && toast) {
    toast.error(msg);
  } else {
    Alert.alert("Error", msg);
  }
};

interface ReviewSectionProps {
  productId: string;
}

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const { data: currentUser } = useCurrentUser();
  const {
    data: reviewsResponse,
    isLoading,
    error,
  } = useProductReviews(productId);
  const { mutate: createReview, isPending: isSubmitting } = useCreateReview();
  const { mutate: deleteReviewMutate, isPending: isDeleting } =
    useDeleteReview();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, comment: "" },
  });

  const rating = watch("rating");

  const onSubmit = (data: ReviewFormData) => {
    createReview(
      { productId, rating: data.rating, comment: data.comment },
      {
        onSuccess: () => {
          showSuccess("Review submitted!");
          reset({ rating: 5, comment: "" });
        },
        onError: (err: any) => {
          showError(
            err?.response?.data?.message ||
              err.message ||
              "Something went wrong",
          );
        },
      },
    );
  };

  const performDelete = (reviewId: string) => {
    deleteReviewMutate(
      { reviewId, productId },
      {
        onSuccess: () => {
          showSuccess("Review deleted!");
        },
        onError: (err: any) => {
          showError(err?.message || "Failed to delete review");
        },
      },
    );
  };

  const handleDelete = (reviewId: string) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm(
        "Are you sure you want to delete this review?",
      );
      if (confirmed) performDelete(reviewId);
    } else {
      Alert.alert(
        "Delete Review",
        "Are you sure you want to delete this review?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => performDelete(reviewId),
          },
        ],
      );
    }
  };

  const reviews = reviewsResponse?.reviews || [];

  return (
    <View className="mt-8 px-5 pb-10">
      <Text className="text-white text-xl font-bold mb-6">Reviews</Text>

      {/* --- Add Review Form --- */}
      <View
        className="rounded-2xl border border-white/10 p-5 mb-8"
        style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
      >
        <Text className="text-white text-base font-semibold mb-3">
          Write a Review
        </Text>

        {/* Star Picker */}
        <View className="flex-row items-center gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setValue("rating", star)}
            >
              <Text
                className={`text-3xl ${
                  star <= rating ? "text-yellow-400" : "text-slate-600"
                }`}
              >
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Comment Input */}
        <Controller
          control={control}
          name="comment"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-white mb-1 min-h-[100px]"
              placeholder="What do you think about this product?"
              placeholderTextColor="#94a3b8"
              multiline
              textAlignVertical="top"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        {errors.comment && (
          <Text className="text-red-400 text-xs mb-3 ml-1">
            {errors.comment.message}
          </Text>
        )}
        {!errors.comment && <View className="mb-3" />}

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
          className="bg-violet-600 rounded-xl py-3.5 items-center justify-center flex-row"
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Text className="text-white font-semibold text-base">
              Submit Review
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* --- Reviews List --- */}
      <View>
        <Text className="text-slate-300 text-sm font-semibold uppercase tracking-wider mb-4">
          Customer Reviews ({reviewsResponse?.pagination?.total || 0})
        </Text>

        {isLoading ? (
          <ActivityIndicator color="#7c3aed" className="py-4" />
        ) : error ? (
          <Text className="text-red-400 py-4">Failed to load reviews</Text>
        ) : reviews.length === 0 ? (
          <Text className="text-slate-400 py-4 text-center">
            No reviews yet. Be the first to review!
          </Text>
        ) : (
          <View className="gap-4">
            {reviews.map((review: Review) => {
              const isOwn = currentUser?._id === review.userId?._id;

              return (
                <View
                  key={review._id}
                  className="border-b border-white/10 pb-4 last:border-0"
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <View>
                      <Text className="text-white font-medium">
                        {review.userId?.name || "Anonymous"}
                      </Text>
                      <View className="flex-row mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Text
                            key={star}
                            className={`text-sm ${
                              star <= review.rating
                                ? "text-yellow-400"
                                : "text-slate-600"
                            }`}
                          >
                            ★
                          </Text>
                        ))}
                      </View>
                    </View>

                    <View className="flex-row items-center gap-3">
                      <Text className="text-slate-500 text-xs">
                        {format(new Date(review.createdAt), "MMM dd, yyyy")}
                      </Text>
                      {isOwn && (
                        <TouchableOpacity
                          onPress={() => handleDelete(review._id)}
                          disabled={isDeleting}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                          style={{ padding: 4 }}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={18}
                            color="#ef4444"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  <Text className="text-slate-300 text-sm leading-relaxed">
                    {review.comment}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </View>
  );
}
