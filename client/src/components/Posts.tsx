import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { createPost, deletePost, getPublicPosts, patchPost } from '../api/posts-api'
import Auth from '../auth/Auth'
import { Post } from '../types/Post'

interface PostsProps {
  auth: Auth
  history: History
}

interface PostsState {
  posts: Post[]
  newPostName: string
  isPublic: string
  loadingPosts: boolean
}

export class Posts extends React.PureComponent<PostsProps, PostsState> {
  state: PostsState = {
    posts: [],
    newPostName: '',
    isPublic: 'false',
    loadingPosts: true
  }

  async componentDidMount() {
    try {
      const posts = await getPublicPosts(this.props.auth.getIdToken())
      console.log("posts: " + posts)
      this.setState({
        posts,
        loadingPosts: false
      })
    } catch (e) {
      alert(`Failed to fetch posts: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">POSTS</Header>
        {this.renderTodos()}
      </div>
    )
  }

  renderTodos() {
    if (this.state.loadingPosts) {
      return this.renderLoading()
    }

    return this.renderTodosList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading POSTS
        </Loader>
      </Grid.Row>
    )
  }

  renderTodosList() {
    return (
      <Grid padded>
        {this.state.posts.map((post, pos) => {
          return (
            <Grid.Row key={post.postId}>
              <Grid.Column width={16} verticalAlign="middle">
                <b>{post.caption}</b>
              </Grid.Column>
              <Grid.Column width={16}>
              {post.attachmentUrl && (
              <Image src={post.attachmentUrl} size="big" style={{marginLeft: 200+'px'}}/>
              )}
                <Divider />
              </Grid.Column>
              
            </Grid.Row>
            
          )
        })}
      </Grid>
    )
  }
}
