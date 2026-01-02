import { motion } from 'framer-motion';
import { Heart, MessageCircle, Share2, Sparkles, Users, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  communityPosts, 
  learningCircles, 
  collabRequests,
  getTodaySpotlight 
} from '@/lib/communityData';
import { cn } from '@/lib/utils';

export function CommunityFeed() {
  const spotlight = getTodaySpotlight();

  return (
    <div className="space-y-8">
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
          {communityPosts.filter(p => !p.isSpotlight).map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="p-4 gradient-card shadow-card">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={post.authorAvatar} />
                    <AvatarFallback>{post.authorName[0]}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{post.authorName}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h4 className="font-serif font-semibold mb-2">{post.title}</h4>
                    <p className="text-sm text-muted-foreground mb-3">{post.content}</p>
                    
                    {post.imageUrl && (
                      <div className="rounded-xl overflow-hidden mb-3 aspect-video">
                        <img 
                          src={post.imageUrl} 
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {post.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <button className="flex items-center gap-1.5 hover:text-rose transition-colors">
                        <Heart className="w-4 h-4" />
                        {post.likes}
                      </button>
                      <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        {post.comments}
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
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
