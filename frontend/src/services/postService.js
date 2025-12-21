class PostService {
  addComment(comment) {
    // In a real app, this would make an API call to add a comment
    console.log(`Adding comment: ${comment}`);
  }
}

export const postService = new PostService();
