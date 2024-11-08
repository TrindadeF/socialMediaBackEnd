import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { commentsModel } from '../../models/comments';
import primaryFeed from '../../models/primaryFeed';

interface IPost {
    owner: {
        _id: string;
        nickName: string;
        profilePic: string;
    };
    createdAt: Date;
    content: string;
    media: string[];
}

interface IComment {
    owner: {
        _id: string;
        profilePic: string;
        nickName: string;
    };
    content: string;
    createdAt: Date;
}

interface IPostCommentsResponse {
    post: IPost;
    comments: IComment[];
}

export const getPostComments = async (req: Request, res: Response) => {
    const { postId } = req.params;

    try {
        const postObjectId = new mongoose.Types.ObjectId(postId);

        
        const post = await primaryFeed
            .findById(postObjectId)
            .populate({
                path: 'owner',
                select: 'nickName profilePic',
            });

        if (!post) {
            return res.status(404).json({ error: 'Post não encontrado' });
        }

        const postOwner = post.owner as unknown as {
            _id: mongoose.Types.ObjectId;
            nickName: string;
            profilePic: string;
        };

        
        const comments = await commentsModel
            .find({ postId: postObjectId })
            .populate({
                path: 'owner',
                select: 'nickName profilePic',
            });

        const formattedComments = comments.map((comment) => {
            const commentOwner = comment.owner as unknown as {
                _id: mongoose.Types.ObjectId;
                nickName: string;
                profilePic: string;
            };

            return {
                id: comment.id,
                owner: {
                    _id: commentOwner._id.toString(),
                    profilePic: commentOwner.profilePic,
                    nickName: commentOwner.nickName,
                },
                content: comment.content,
                createdAt: comment.createdAt,
            };
        });

      
        const response: IPostCommentsResponse = {
            post: {
                owner: {
                    _id: postOwner._id.toString(),
                    nickName: postOwner.nickName,
                    profilePic: postOwner.profilePic,
                },
                createdAt: post.createdAt,
                content: post.content,
                media: post.media,
            },
            comments: formattedComments,
        };

        return res.status(200).json(response);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erro ao buscar comentários do post' });
    }
};
