import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a post title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true
    },
    excerpt: {
      type: String,
      required: [true, 'Please provide a short excerpt'],
      trim: true,
      maxlength: [300, 'Excerpt cannot exceed 300 characters']
    },
    content: {
      type: String,
      required: [true, 'Please provide post content']
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      trim: true,
      enum: ['Engineering', 'Design', 'Product', 'Culture', 'AI & Future', 'Career', 'Tutorial']
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80'
    },
    readTime: {
      type: String,
      default: '4 min read'
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Post must have an author']
    }
  },
  {
    timestamps: true
  }
);

// Auto-generate slug and estimate readTime before saving
postSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-') + '-' + Date.now().toString(36);
  }

  if (this.isModified('content')) {
    const wordCount = (this.content || '').split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    this.readTime = `${minutes} min read`;
  }

  next();
});

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;
