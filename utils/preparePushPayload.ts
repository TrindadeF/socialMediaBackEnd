interface NotificationPayload {
    title: string
    body: string
    icon?: string
    url?: string
}

export function preparePushPayload(data: any): NotificationPayload[] {
    const notifications: NotificationPayload[] = []

    if (data.profileLikes) {
        data.profileLikes.forEach((like: any) => {
            notifications.push({
                title: 'Nova curtida no seu perfil!',
                body: `${like.name} curtiu seu perfil.`,
                icon: like.profilePic,
                url: '/profile',
            })
        })
    }

    if (data.likesOnPrimaryPosts) {
        data.likesOnPrimaryPosts.forEach((post: any) => {
            post.likedBy.forEach((user: any) => {
                notifications.push({
                    title: 'Nova curtida no seu post!',
                    body: `${user.name} curtiu seu post: "${post.content}".`,
                    icon: user.profilePic,
                    url: `/post/${post.postId}`,
                })
            })
        })
    }

    if (data.followers) {
        data.followers.forEach((follower: any) => {
            notifications.push({
                title: 'Novo seguidor!',
                body: `${follower.name} começou a seguir você.`,
                icon: follower.profilePic,
                url: '/followers',
            })
        })
    }

    return notifications
}
