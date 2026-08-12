import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Star, MessageSquarePlus } from 'lucide-react';

export const ReviewModal: React.FC = () => {
  const { isReviewModalOpen, setIsReviewModalOpen, addReview, products } = useStore();

  const [productId, setProductId] = useState('');
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    if (products.length > 0 && !productId) {
      setProductId(products[0].id);
    }
  }, [products, productId]);

  if (!isReviewModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !comment.trim()) return;

    addReview({
      productId,
      author,
      title: title || 'Great Quality Product!',
      comment,
      rating
    });

    setIsReviewModalOpen(false);
    setAuthor('');
    setTitle('');
    setComment('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl p-6 sm:p-8 relative border border-slate-200">
        <button
          onClick={() => setIsReviewModalOpen(false)}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-[#2C3539] hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
            <MessageSquarePlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#2C3539] font-serif">Write a Verified Review</h3>
            <p className="text-xs text-slate-500">Share your product experience with our community</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Select Product</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#2C3539] font-medium"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (${p.price.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Overall Rating</label>
            <div className="flex items-center gap-1 text-amber-400 py-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 transition-transform ${
                      (hoverRating || rating) >= star
                        ? 'fill-current scale-110'
                        : 'text-slate-200 fill-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. David Vance"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#2C3539]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Review Headline</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Exceptional Build & Rapid Delivery!"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#2C3539]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Your Feedback Comment</label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe sound quality, fit, material quality, or Cash on Delivery convenience..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-[#2C3539]"
            />
          </div>

          <div className="pt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsReviewModalOpen(false)}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md"
            >
              Submit Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
