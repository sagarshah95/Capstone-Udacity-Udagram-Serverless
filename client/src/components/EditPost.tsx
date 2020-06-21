import * as React from 'react'
import { Form, Button } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUploadUrl, uploadFile, patchPost, getPostsById } from '../api/posts-api'
import { UpdatePostRequest } from '../types/UpdatePostRequest'
import { Post } from '../types/Post'
import { History } from 'history'

enum UpdateState {
  NoUpload,
  FetchingPresignedUrl,
  UploadingFile
}

interface EditPostProps {
  match: {
    params: {
      postId: string
    }
  }
  auth: Auth
  history: History
}

interface EditPostState {
  file: any
  post: Post
  caption: string
  isPublic: string
  uploadState: UpdateState
}

export class EditPost extends React.PureComponent<
  EditPostProps,
  EditPostState
> {
  state: EditPostState = {
    file: undefined,
    post: {} as Post,
    caption: '',
    isPublic: '',
    uploadState: UpdateState.NoUpload
  }

  handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    this.setState({
      file: files[0]
    })
  }

  handlePropertyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    
    if(event.target.id == "caption"){
      this.setState({
        caption: event.target.value
      })
    }

    if(event.target.id == "isPublic"){
      if (event.target.checked){
        this.setState({
          isPublic: 'true'
        })
      }
      else{
        this.setState({
          isPublic: 'false'
        })
      }
    }
    
  }

  handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault()

    try {
      if(this.state.file) {
        this.setUploadState(UpdateState.FetchingPresignedUrl)
        const uploadUrl = await getUploadUrl(this.props.auth.getIdToken(), this.props.match.params.postId)

        this.setUploadState(UpdateState.UploadingFile)
        await uploadFile(uploadUrl, this.state.file)

        alert('File was uploaded!')
      }

    } catch (e) {
      alert('Could not upload a file: ' + e.message)
    } finally {
      this.setUploadState(UpdateState.NoUpload)
    }

    //Upating caption
    try{ 
      const updatedPost: UpdatePostRequest =  {
        caption: this.state.post.caption,
        isPublic: this.state.post.isPublic
      }
      
      if(this.state.caption != '') {updatedPost.caption = this.state.caption}
      if(this.state.isPublic != '') {updatedPost.isPublic = this.state.isPublic}

      await patchPost(this.props.auth.getIdToken(), this.props.match.params.postId, updatedPost)
      alert('Post was updated!')
    }
    catch (e) {
      alert('Could not update the post: ' + e.message)
    }
  }

  setUploadState(uploadState: UpdateState) {
    this.setState({
      uploadState
    })
  }

  async componentDidMount() {
    try {
      const post = await getPostsById(this.props.auth.getIdToken(), this.props.match.params.postId)
      console.log(post)
      this.setState({post})
    } catch (e) {
      alert(`Failed to fetch posts: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <h1>Upload new image</h1>

        <Form onSubmit={this.handleSubmit}>
          <Form.Field>
            <label>Caption</label>
            <input type="text" placeholder="Caption" id="caption" value={this.state.caption} onChange={this.handlePropertyChange}></input>
            <br></br>

            <label>Is Public</label>
            <input type="checkbox" id="isPublic" value={this.state.isPublic} onChange={this.handlePropertyChange}></input>
            <br></br>

            <label>File</label>
            <input
              type="file"
              accept="image/*"
              placeholder="Image to upload"
              onChange={this.handleFileChange}
            />
          </Form.Field>

          {this.renderButton()}
        </Form>
      </div>
    )
  }

  renderButton() {

    return (
      <div>
        {this.state.uploadState === UpdateState.FetchingPresignedUrl && <p>Uploading image metadata</p>}
        {this.state.uploadState === UpdateState.UploadingFile && <p>Uploading file</p>}
        <Button
          loading={this.state.uploadState !== UpdateState.NoUpload}
          type="submit"
        >
          Update Post
        </Button>
      </div>
    )
  }
}
