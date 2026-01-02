import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Sparkles, Users, BookOpen, Plus, Send, UserPlus, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  learningCircles, 
  collabRequests,
  getTodaySpotlight 
} from '@/lib/communityData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface CommunityPost {
  id: string;
  user_id: string;
  title: string;
  content: string;
  image_url: string | null;
  tags: string[];
  likes: number;
  created_at: string;
  profile?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  profile?: {
    display_name: string | null;
    avatar_url: string | null;
  };
}

export function CommunityFeed() {
  const { user } = useAuth();
  const spotlight = getTodaySpotlight();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postTags, setPostTags] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [followingUsers, setFollowingUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPosts();
    if (user) {
      fetchUserLikes();
      fetchFollowing();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          profile:profiles!community_posts_user_id_fkey(display_name, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setPosts((data as unknown as CommunityPost[]) || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserLikes = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', user.id);
    
    if (data) {
      setLikedPosts(new Set(data.map(l => l.post_id)));
    }
  };

  const fetchFollowing = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', user.id);
    
    if (data) {
      setFollowingUsers(new Set(data.map(f => f.following_id)));
    }
  };

  const handleCreatePost = async () => {
    if (!user || !postTitle || !postContent) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsPosting(true);
    try {
      const { error } = await supabase.from('community_posts').insert({
        user_id: user.id,
        title: postTitle,
        content: postContent,
        tags: postTags.split(',').map(t => t.trim()).filter(Boolean)
      });

      if (error) throw error;

      toast.success('Post created!');
      setNewPostOpen(false);
      setPostTitle('');
      setPostContent('');
      setPostTags('');
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      setIsPosting(false);
    }
  };

  const handleLike = async (postId: string) => {
    if (!user) {
      toast.error('Please sign in to like posts');
      return;
    }

    const isLiked = likedPosts.has(postId);

    try {
      if (isLiked) {
        await supabase.from('post_likes').delete()
          .eq('user_id', user.id)
          .eq('post_id', postId);
        setLikedPosts(prev => {
          const next = new Set(prev);
          next.delete(postId);
          return next;
        });
      } else {
        await supabase.from('post_likes').insert({
          user_id: user.id,
          post_id: postId
        });
        setLikedPosts(prev => new Set(prev).add(postId));
      }
      
      // Update post likes count
      const post = posts.find(p => p.id === postId);
      if (post) {
        await supabase.from('community_posts').update({
          likes: post.likes + (isLiked ? -1 : 1)
        }).eq('id', postId);
        fetchPosts();
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleFollow = async (userId: string) => {
    if (!user) {
      toast.error('Please sign in to follow users');
      return;
    }

    const isFollowing = followingUsers.has(userId);

    try {
      if (isFollowing) {
        await supabase.from('follows').delete()
          .eq('follower_id', user.id)
          .eq('following_id', userId);
        setFollowingUsers(prev => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
        toast.success('Unfollowed');
      } else {
        await supabase.from('follows').insert({
          follower_id: user.id,
          following_id: userId
        });
        setFollowingUsers(prev => new Set(prev).add(userId));
        toast.success('Following!');
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
    }
  };

  const fetchComments = async (postId: string) => {
    const { data } = await supabase
      .from('comments')
      .select(`
        *,
        profile:profiles!comments_user_id_fkey(display_name, avatar_url)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    
    setComments((data as unknown as Comment[]) || []);
  };

  const handleAddComment = async (postId: string) => {
    if (!user || !newComment) return;

    try {
      await supabase.from('comments').insert({
        user_id: user.id,
        post_id: postId,
        content: newComment
      });
      setNewComment('');
      fetchComments(postId);
      toast.success('Comment added!');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
    }
  };

  return (
    <div className="space-y-8">
      {/* Create Post Button */}
      {user && (
        <Dialog open={newPostOpen} onOpenChange={setNewPostOpen}>
          <DialogTrigger asChild>
            <Button className="w-full gap-2 gradient-button text-primary-foreground">
              <Plus className="w-4 h-4" />
              Share Your Art
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Post title"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
              />
              <Textarea
                placeholder="Share your thoughts, artwork, or discoveries..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                rows={4}
              />
              <Input
                placeholder="Tags (comma separated)"
                value={postTags}
                onChange={(e) => setPostTags(e.target.value)}
              />
              <Button 
                onClick={handleCreatePost} 
                disabled={isPosting}
                className="w-full"
              >
                {isPosting ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Today's Spotlight */}
      {spotlight && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-gold" />
            <h2 className="font-serif text-xl font-semibold">Today's Spotlight</h2>
          </div>
          
          <Card className="overflow-hidden gradient-card shadow-elevated gold-border">
            <div className="md:flex">
              <div className="md:w-1/2 aspect-square md:aspect-auto overflow-hidden">
                <img 
                  src={spotlight.imageUrl} 
                  alt={spotlight.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 md:w-1/2 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <Avatar>
                    <AvatarImage src={spotlight.authorAvatar} />
                    <AvatarFallback>{spotlight.authorName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{spotlight.authorName}</p>
                    <p className="text-xs text-muted-foreground">Featured Artist</p>
                  </div>
                </div>
                
                <h3 className="font-serif text-2xl font-semibold mb-2">{spotlight.title}</h3>
                <p className="text-muted-foreground mb-4 flex-1">{spotlight.content}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {spotlight.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="bg-gold/20 text-gold-foreground">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center gap-4 text-muted-foreground">
                  <button className="flex items-center gap-1.5 hover:text-rose transition-colors">
                    <Heart className="w-4 h-4" />
                    {spotlight.likes}
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    {spotlight.comments}
                  </button>
                  <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Tabs */}
      <Tabs defaultValue="feed" className="w-full">
        <TabsList className="w-full justify-start mb-6 bg-muted/50">
          <TabsTrigger value="feed">Feed</TabsTrigger>
          <TabsTrigger value="collabs">Collabs</TabsTrigger>
          <TabsTrigger value="circles">Learning Circles</TabsTrigger>
        </TabsList>

        <TabsContent value="feed" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No posts yet. Be the first to share!
            </div>
          ) : (
            posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="p-4 gradient-card shadow-card">
                  <div className="flex items-start gap-3">
                    <Avatar>
                      <AvatarImage src={post.profile?.avatar_url || undefined} />
                      <AvatarFallback>{(post.profile?.display_name || 'U')[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{post.profile?.display_name || 'Anonymous'}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {user && post.user_id !== user.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFollow(post.user_id)}
                            className="gap-1"
                          >
                            {followingUsers.has(post.user_id) ? (
                              <>
                                <Check className="w-3 h-3" />
                                Following
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-3 h-3" />
                                Follow
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                      
                      <h4 className="font-serif font-semibold mb-2">{post.title}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{post.content}</p>
                      
                      {post.image_url && (
                        <div className="rounded-xl overflow-hidden mb-3 aspect-video">
                          <img 
                            src={post.image_url} 
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.tags?.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <button 
                          onClick={() => handleLike(post.id)}
                          className={cn(
                            "flex items-center gap-1.5 transition-colors",
                            likedPosts.has(post.id) ? "text-rose-500" : "hover:text-rose-500"
                          )}
                        >
                          <Heart className={cn("w-4 h-4", likedPosts.has(post.id) && "fill-current")} />
                          {post.likes}
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedPost(selectedPost === post.id ? null : post.id);
                            if (selectedPost !== post.id) fetchComments(post.id);
                          }}
                          className="flex items-center gap-1.5 hover:text-primary transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Comment
                        </button>
                      </div>

                      {/* Comments Section */}
                      <AnimatePresence>
                        {selectedPost === post.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mt-4 pt-4 border-t space-y-3"
                          >
                            {comments.map(comment => (
                              <div key={comment.id} className="flex gap-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={comment.profile?.avatar_url || undefined} />
                                  <AvatarFallback className="text-xs">
                                    {(comment.profile?.display_name || 'U')[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 bg-muted/50 rounded-lg p-2">
                                  <p className="text-xs font-medium">{comment.profile?.display_name || 'Anonymous'}</p>
                                  <p className="text-sm">{comment.content}</p>
                                </div>
                              </div>
                            ))}
                            
                            {user && (
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Write a comment..."
                                  value={newComment}
                                  onChange={(e) => setNewComment(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                                />
                                <Button size="icon" onClick={() => handleAddComment(post.id)}>
                                  <Send className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </TabsContent>

        <TabsContent value="collabs" className="space-y-4">
          {collabRequests.map((collab, index) => (
            <motion.div
              key={collab.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 gradient-card shadow-card">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={collab.authorAvatar} />
                    <AvatarFallback>{collab.authorName[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{collab.authorName}</span>
                      {collab.deadline && (
                        <Badge variant="secondary" className="text-xs">
                          Due: {new Date(collab.deadline).toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                    
                    <h4 className="font-serif font-semibold mb-2">{collab.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{collab.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs text-muted-foreground">Looking for:</span>
                      {collab.seeking.map(role => (
                        <Badge key={role} className="bg-primary/10 text-primary">
                          {role}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        {collab.responses} responses
                      </span>
                      <Button size="sm" className="gradient-button text-primary-foreground">
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        <TabsContent value="circles" className="grid gap-4 md:grid-cols-2">
          {learningCircles.map((circle, index) => (
            <motion.div
              key={circle.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="overflow-hidden gradient-card shadow-card hover:shadow-elevated transition-all cursor-pointer">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={circle.imageUrl} 
                    alt={circle.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <Badge variant="secondary">{circle.style}</Badge>
                  </div>
                  <h4 className="font-serif font-semibold mb-1">{circle.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{circle.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      {circle.memberCount.toLocaleString()} members
                    </div>
                    <Button size="sm" variant="outline">
                      Join
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
