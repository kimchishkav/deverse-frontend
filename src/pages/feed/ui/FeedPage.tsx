import { MainLayout } from "@/widgets/layout";
import { PostList } from "@/widgets/post-list";
import { type Post } from "@/entities/post";
import annaAvatar from "@/assets/img/AnnaNekrassova.jpeg";

const mockPosts: Post[] = [
  {
    id: 1,
    content:
      "We’re looking for a Frontend Developer for a startup project!\n\nStack: React + TypeScript.\nGoal — build an MVP within a month.\nMessage me if you'd like to join",
    likesCount: 478,
    commentsCount: 79,
    viewsCount: 551,
    author: {
      id: 1,
      name: "Anna Nekrassova",
      profession: "Backend Engineer",
      avatar: annaAvatar,
    },
  },
  {
    id: 2,
    content:
      "Deployed a hotfix at 2:14 AM.\nEverything works.\nI will now sleep like I saved the world.",
    likesCount: 867,
    commentsCount: 142,
    viewsCount: 982,
    author: {
      id: 2,
      name: "Noah Reynolds",
      profession: "DevOps Engineer",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
  },
  {
    id: 3,
    content:
      "QA tip:\nIf you think it works — test it again.\nIf you're sure — test it twice.",
    likesCount: 478,
    commentsCount: 79,
    viewsCount: 551,
    author: {
      id: 3,
      name: "Ava Thompson",
      profession: "QA Engineer",
      avatar: "https://i.pravatar.cc/150?img=45",
    },
  },
];

export const FeedPage = () => {
  return (
    <MainLayout>
      <PostList posts={mockPosts} />
    </MainLayout>
  );
};
