import axios from "axios";
import { useEffect, useState } from "react";
import { categories, lostfoundUrl } from "../../data-types/constants";
import {
  OwnPost,
  ProfileContextType,
  UserContextType,
} from "../../data-types/datatypes";
import { LostFoundPost } from "../../data-types/posts";
import { EditPostProps } from "../../data-types/props";
import { isFileImage, resizeImageFile } from "../PostHelpers";
import {
  useAuthContext,
  useProfileContext,
} from "../authentication/AuthHelpers";
import ErrorModal from "../components/ErrorModal";
import Loader from "../components/Loader";
import SuccessModal from "../components/SuccessModal";

export default function EditLostAndFoundPost(props: EditPostProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<LostFoundPost>({} as LostFoundPost);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isEdited, setIsEdited] = useState<boolean>(false);
  const user = (useAuthContext() as unknown as UserContextType).user;
  const profileDispatch = (useProfileContext() as unknown as ProfileContextType)
    .profileDispatch;

  // this is required to show the category of post
  const handleCategoryChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    event.preventDefault();
    setSelectedCategory(event.target.value);
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${lostfoundUrl}/${props.postId}`)
      .then((res) => {
        setPost(res.data);
        setSelectedCategory(res.data.category);
      })
      .catch((err) => {
        console.log(err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [props]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    if (
      !formData.get("title") ||
      !formData.get("description") ||
      !formData.get("image") ||
      !formData.get("category")
    ) {
      setError("ALL INPUT FIELDS MUST BE SPECIFIED");
      setLoading(false);
      return;
    }

    const editedPost: LostFoundPost = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      image: isFileImage(formData.get("image") as File) //if no file is submitted then do not include image in the userProfile body
        ? await resizeImageFile(formData.get("image") as File)
        : post.image,
      category: formData.get("category") as string,
      status: post.status,
      poster: user?._id as string,
    };

    await axios
      .put(`${lostfoundUrl}/${props.postId}`, editedPost)
      .catch((err) => {
        console.log(err);
        setError(err);
      });

    const profile = JSON.parse(localStorage.getItem("profile") as string);
    let index;

    if (profile) {
      index = profile.ownPosts.findIndex(
        (post: OwnPost) => post.id === props.postId
      );
    }
    if (index) {
      profile.ownPosts[index].title = editedPost.title;
    }
    localStorage.setItem("profile", JSON.stringify(profile));
    profileDispatch({ type: "UPDATE", payload: profile });

    setLoading(false);
    if (error === null || error === undefined) {
      setIsEdited(true);
    }
  };

  if (isEdited) {
    window.location.reload();
  }

  return (
    <div className="modal-overlay">
      <form
        onSubmit={handleSubmit}
        className="create-item-form"
        style={{ width: "35vw" }}
      >
        {loading && <Loader />}
        <span className="close" onClick={props.onClose}>
          &times;
        </span>
        {isEdited ? (
          <SuccessModal />
        ) : (
          <>
            <div>
              <div
                className="modal-form-group pt-4"
                style={{ textAlign: "left" }}
              >
                <label htmlFor="name">Title:</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  className="form-control"
                  defaultValue={post.title}
                  placeholder="Enter title"
                />
              </div>
              <div className="modal-form-group" style={{ textAlign: "left" }}>
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-control"
                  defaultValue={post.description}
                  style={{ height: "15vh" }}
                />
              </div>
            </div>

            <div className="modal-form-group" style={{ textAlign: "left" }}>
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                className="form-control"
                value={selectedCategory}
                onChange={handleCategoryChange}
              >
                {categories.lostfound.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-form-group" style={{ textAlign: "left" }}>
              <label htmlFor="image">Image:</label>
              <input
                type="file"
                id="image"
                name="image"
                accept="jpg, jpeg, png"
                className="form-control"
                defaultValue={post.image}
              />
            </div>

            <div className="modal-form-group mt-4">
              <button type="submit" className="btn btn-primary">
                Edit Post
              </button>
            </div>
            {error && (
              <ErrorModal
                message={error}
                onClose={() => {
                  setError(null);
                }}
              />
            )}
          </>
        )}
      </form>
    </div>
  );
}
