import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { backendUrl } from "../constants";
import "../styles/Post.css";
import PostStats from "../components/Post/PostStats";
import Comment from "../components/Post/Comment";

export default function Post() {
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [date, setDate] = useState();
  const { id } = useParams();

  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(0);
  const [commentsFetched, setCommentsFetched] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [loader, setLoader] = useState("");
  const navigate = useNavigate();
  const commentList = useRef();
  const getComments = async () => {
    const response = await axios.get(
      `${backendUrl}/api/v1/posts/getComments/${post._id}/${page}`
    );
    if (response.data.data.length > 0) {
      setComments((prev) => {
        return [...prev, ...response.data.data];
      });
    } else {
      setCommentsFetched(true);
    }
  };
  const addComment = async (e) => {
    try {
      e.preventDefault();
      await axios.post(
        `${backendUrl}/api/v1/posts/newComment`,
        {
          postId: post._id,
          commentText: commentText,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setCommentText("");
      setCommentsFetched(false);
      setComments([]);
      setPage(0);
      getComments();
    } catch (error) {
      navigate("/error", { state: { error: error.response.data.error } });
    }
  };
  useEffect(() => {
    if (!commentsFetched && post) {
      getComments();
    }
  }, [page, post]);

  useEffect(() => {
    const getPost = async () => {
      const response = await axios.get(
        `${backendUrl}/api/v1/posts/getPost/${id}`
      );
      setPost(response.data.data);
    };
    if (id) {
      getPost();
    }
  }, [id]);

  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get(
        `${backendUrl}/api/v1/users/getUser/${post.user}`
      );
      setUser(response.data.data);
    };
    if (post) {
      getUser();
      let newDate = new Date(post.createdAt);
      setDate(newDate.toLocaleDateString("en-GB"));
    }
  }, [post]);

  return (
    <>
      {post && (
        <div className="post-page-container">
          <img src={post.url} alt="" className="post-image" />
          <div className="post-page-info">
            <div className="row-one">
              {user && (
                <>
                  <div
                    onClick={() => {
                      navigate(`/user/${user.username}`);
                    }}
                  >
                    <img src={user.avatar} alt="" className="post-user-image" />
                    <h3>{user.username}</h3>
                  </div>
                  <p>{date}</p>
                </>
              )}
            </div>
            {post && user && (
              <div className="responsive-stats">
                <PostStats
                  currentPost={post}
                  addComment={addComment}
                  commentText={commentText}
                  setCommentText={setCommentText}
                  info={false}
                />
              </div>
            )}
            <div className="comments-container">
              <div ref={commentList}>
                {comments.map((comment, index) => (
                  <Comment
                    isComment={true}
                    comment={comment}
                    key={index}
                    getComments={getComments}
                    setComments={setComments}
                    setCommentsFetched={setCommentsFetched}
                    setPage={setPage}
                  />
                ))}
              </div>
              {!commentsFetched && (
                <>
                  <button
                    className="btn-more-comments btn-secondary"
                    onClick={() => {
                      setPage((prev) => prev + 1);
                    }}
                  >
                    View more comments
                  </button>
                </>
              )}
              {commentsFetched && (
                <>
                  <p className="comments-error">No more comments</p>
                </>
              )}
              {!commentsFetched && (
                <>
                  <div className={`comments-loader ${loader}`}>
                    <div></div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
