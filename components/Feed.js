import { DotsHorizontalIcon, SparklesIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import Input from "./Input";
import { onSnapshot, collection, query, orderBy } from "@firebase/firestore";
import { db } from "../firebase";
import Post from "./Post";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";

function Feed() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [logStatus, setLogStatus] = useState(false)

  // MESSY
  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setPosts(snapshot.docs);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [db]);

  // CLEAN
  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "posts"), orderBy("timestamp", "desc")),
        (snapshot) => {
          setPosts(snapshot.docs);
        }
      ),
    [db]
  );

  return (
    <div className="flex-grow text-white border border-r border-gray-700 max-w-2xl sm:ml-[60px] md:ml-[73px] xl:ml-[370px] overflow-y-auto">
      <div className="text-[#d9d9d9] py-2 px-3 sticky top-0 z-50 bg-black border-b border-gray-700">
        <div className=" flex items-center sm:justify-between gap-6">
          <div className="sm:hidden md:hidden flex flex-col items-center" onClick={() => setLogStatus(!logStatus)}>
            <Image src={session.user.image} alt="" width={30} height={30} className="rounded-full cursor-pointer" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold cursor-pointer">Home</h2>
          <div className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0 ml-auto">
            <SparklesIcon className="h-5 text-white" title="Lk" />
          </div>
        </div>
        {logStatus &&
        <div className="sm:hidden bg-black shadow-md shadow-gray-500 w-32 flex gap-2 items-center border border-gray-500 mx-3 rounded px-3 py-1 cursor-pointer" onClick={signOut}>
          <p>Log Out</p>
          <DotsHorizontalIcon className="h-5" />
        </div>
      }
      </div>
      <Input />
      <div className="pb-72">
        {posts.map((post) => (
          <Post key={post.id} id={post.id} post={post.data()} />
        ))}
      </div>
    </div>
  );
}

export default Feed;
