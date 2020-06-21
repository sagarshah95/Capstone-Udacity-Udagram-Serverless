import * as uuid from 'uuid'
import { PostItem } from '../models/PostItem'
import { CreatePostRequest } from '../requests/CreatePostRequest'
import { UpdatePostRequest } from '../requests/UpdatePostRequest'
import { PostAccess } from '../dataLayer/PostsAccess'
import { createLogger } from '../utils/logger'

const postAccess = new PostAccess()
const logger = createLogger('todos')

export async function GetPosts(userId: string): Promise<PostItem[]>{
    
    logger.info('In GetPost() function')
    return await postAccess.GetPosts(userId)
}

export async function GetPublicPosts(): Promise<PostItem[]>{
    
    logger.info('In GetPublicPosts() function')
    return await postAccess.GetPublicPosts()
}

export async function GetPostsById(postId): Promise<PostItem>{
    
    logger.info('In GetPostsById() function')
    return await postAccess.GetPostsById(postId)
}

export async function CreatePost(CreatePostRequest: CreatePostRequest, userId: string): Promise<PostItem>{
    
    logger.info('In CreatePost() function')
    const postId = uuid.v4()

    return await postAccess.CreatePost({
        userId: userId,
        postId: postId,
        createdAt: new Date().toISOString(),
        caption: CreatePostRequest.caption,
        isPublic: CreatePostRequest.isPublic
    })
}

export async function UpdatePost(postId: string, updatedPost: UpdatePostRequest, userId: string): Promise<string>{

    logger.info('In UpdatePost() function')
    return await postAccess.UpdatePost({
        userId: userId,
        postId: postId,
        createdAt: new Date().toISOString(),
        caption: updatedPost.caption,
        isPublic: updatedPost.isPublic,
    })
}

export async function DeletePost(postId: string, userId: string): Promise<string>{

    logger.info('In DeletePost() function')
    return await postAccess.DeletePost(postId, userId)
}

export async function GenerateUploadUrl(postId: string): Promise<string>{

    logger.info('In GenerateUploadUrl() function')
    return await postAccess.GenerateUploadUrl(postId)
}