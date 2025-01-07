"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.preparePushPayload = preparePushPayload;
function preparePushPayload(data) {
    const notifications = [];
    if (data.profileLikes) {
        data.profileLikes.forEach((like) => {
            notifications.push({
                title: 'Nova curtida no seu perfil!',
                body: `${like.name} curtiu seu perfil.`,
                icon: like.profilePic,
                url: '/profile',
            });
        });
    }
    if (data.likesOnPrimaryPosts) {
        data.likesOnPrimaryPosts.forEach((post) => {
            post.likedBy.forEach((user) => {
                notifications.push({
                    title: 'Nova curtida no seu post!',
                    body: `${user.name} curtiu seu post: "${post.content}".`,
                    icon: user.profilePic,
                    url: `/post/${post.postId}`,
                });
            });
        });
    }
    if (data.followers) {
        data.followers.forEach((follower) => {
            notifications.push({
                title: 'Novo seguidor!',
                body: `${follower.name} começou a seguir você.`,
                icon: follower.profilePic,
                url: '/followers',
            });
        });
    }
    return notifications;
}
