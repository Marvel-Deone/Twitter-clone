import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc, } from "@firebase/firestore";
import {
    ChartBarIcon,
    ChatIcon,
    DotsHorizontalIcon,
    HeartIcon,
    ShareIcon,
  } from "@heroicons/react/outline";
  import { HeartIcon as HeartIconFilled } from "@heroicons/react/solid"
import Image from "next/image";
  import Moment from "react-moment";
  import { useEffect, useState } from "react";
  import { useSession } from "next-auth/react";
  import { useRecoilState } from "recoil";
  import { modalState, postIdState } from "../atoms/modalAtom";
  import { db } from "../firebase";
  
  function Comment({ comment, id, post, postPage }) {
    const { data: session } = useSession()
    const [isOpen, setIsOpen] = useRecoilState(modalState);
    // const [isOpen, setIsOpen] = useRecoilState(modalState);
    const [postId, setPostId] = useRecoilState(postIdState);
    const [comments, setComments] = useState([]);
    const [likes, setLikes] = useState([]);
    const [liked, setLiked] = useState(false);
    useEffect(
      () =>
        onSnapshot(
          query(
            collection(db, "posts", id, "comments"),
            orderBy("timestamp", "desc")
          ),
          (snapshot) => setComments(snapshot.docs)
        ),
      [db, id]
    );

    useEffect(
      () =>
        onSnapshot(collection(db, "comments", id, "likes"), (snapshot) =>
          setLikes(snapshot.docs)
        ),
      [db, id]
    );
  
    useEffect(
      () =>
        setLiked(
          likes.findIndex((like) => like.id === session?.user?.uid) !== -1
        ),
      [likes]
    );
  
    const likePost = async () => {
      if (liked) {
        await deleteDoc(doc(db, "comments", id, "likes", session.user.uid));
      } else {
        await setDoc(doc(db, "comments", id, "likes", session.user.uid), {
          username: session.user.name,
        });
      }
    };
  
    return (
      <div className="p-3 flex cursor-pointer border-b border-gray-700">
        {/* <Image
          src={comment?.userImg}
          className=" rounded-full h-11 w-11 mr-4"
          width={2.75} height={2.75}
          alt=""
          // h-11 w-11
         
        /> */}
        <div className="flex flex-col space-y-2 w-full">
          <div className="flex justify-between">
            <div className="text-[#6e767d]">
              <div className="inline-block group">
                <h4 className="font-bold text-[#d9d9d9] text-[15px] sm:text-base inline-block group-hover:underline">
                  {comment?.username}
                </h4>
                <span className="ml-1.5 text-sm sm:text-[15px]">
                  @{comment?.tag}{" "}
                </span>
              </div>{" "}
              ·{" "}
              <span className="hover:underline text-sm sm:text-[15px]">
                <Moment fromNow>{comment?.timestamp?.toDate()}</Moment>
              </span>
              <p className="text-[#d9d9d9] mt-0.5 max-w-lg overflow-auto text-[15px] sm:text-base">
                {comment?.comment}
              </p>
            </div>
            <div className="icon group flex-shrink-0">
              <DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
            </div>
          </div>
  
          <div className="text-[#6e767d] flex justify-between w-10/12">
            <div
              className="flex items-center space-x-1 group"
              onClick={(e) => {
                e.stopPropagation();
                setPostId(id);
                setIsOpen(true);
                console.log(id);
              }}
            >
              <div className="icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-10">
                <ChatIcon className="h-5 group-hover:text-[#1d9bf0]" />
              </div>
              {comments.length > 0 && (
                <span className="group-hover:text-[#1d9bf0] text-sm">
                  {comments.length}
                </span>
              )}
            </div>
  
            {/* <div className="flex items-center space-x-1 group">
              <div className="icon group-hover:bg-pink-600/10">
                <HeartIcon className="h-5 group-hover:text-pink-600" />
              </div>
              <span className="group-hover:text-pink-600 text-sm"></span>
            </div> */}
            <div
              className="flex items-center space-x-1 group"
              onClick={(e) => {
                e.stopPropagation();
                likePost();
              }}
            >
              <div className="icon group-hover:bg-pink-600/10">
                {liked ? (
                  <HeartIconFilled className="h-5 text-pink-600" />
                ) : (
                  <HeartIcon className="h-5 group-hover:text-pink-600" />
                )}
              </div>
              {likes.length > 0 && (
                <span
                  className={`group-hover:text-pink-600 text-sm ${
                    liked && "text-pink-600"
                  }`}
                >
                  {likes.length}
                </span>
              )}
            </div>
  
            <div className="icon group">
              <ShareIcon className="h-5 group-hover:text-[#1d9bf0]" />
            </div>
            <div className="icon group">
              <ChartBarIcon className="h-5 group-hover:text-[#1d9bf0]" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  export default Comment;
  