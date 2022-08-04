import { PhotographIcon, XIcon, CalendarIcon, ChartBarIcon, EmojiHappyIcon, } from "@heroicons/react/solid";
import { useRef, useState } from "react";
import { db, storage } from "../firebase";
import { addDoc, collection, doc, serverTimestamp, updateDoc, } from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { useSession } from "next-auth/react";
import Image from "next/image";

function Input() {
    const [input, setInput] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    // const [showEmojis, setShowEmojis] = useState(false);
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();
    const filePickerRef = useRef(null);

    const hello = () => {
        alert('Hello')
    }

    const addImageToPost = (e) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }
        reader.onload = (readerEvent) => {
            setSelectedFile(readerEvent.target.result);
        };
    };

    const sendPost = async () => {
        if (loading) return;
        setLoading(true);
        const docRef = await addDoc(collection(db, "posts"), {
            id: session.user.uid,
            username: session.user.name,
            userImg: session.user.image,
            tag: session.user.tag,
            text: input,
            timestamp: serverTimestamp(),
        });
        const imageRef = ref(storage, `posts/${docRef.id}/image`);
        if (selectedFile) {
            await uploadString(imageRef, selectedFile, "data_url").then(async () => {
                const downloadURL = await getDownloadURL(imageRef);
                await updateDoc(doc(db, "posts", docRef.id), {
                    image: downloadURL,
                });
            });
        }
        setLoading(false);
        setInput("");
        setSelectedFile(null);
    };


    return (
        <div
            className={`hidden sm:flex border-b border-gray-700 p-3 text-white flex space-x-3 overflow-y-auto ${loading && "opacity-60"}`}
        >
            <div>
                <Image src={session.user.image} alt="" width={45} height={45} className="rounded-full cursor-pointer" />
            </div>
            <div className="w-full">
                {/* <div className="w-full divide-y divide-gray-700 "> */}
                <div className={`${selectedFile && "pb-7"} ${input && "space-y-2.5"}`}>
                    <textarea placeholder="What's happening?" onChange={(e) => setInput(e.target.value)} value={input} rows="2" className="bg-transparent outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide w-full min-h-[50px] max-h-12" />
                    {selectedFile && (
                        <div className="relative">
                            <div
                                className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
                                onClick={() => setSelectedFile(null)}
                            // onClick={hello}
                            >
                                <XIcon className="text-white h-5 cursor-pointer" />
                            </div>
                            <Image
                                src={selectedFile}
                                alt=""
                                width={420} height={420}
                                className="rounded-2xl max-h-80 object-contain"
                            />
                        </div>
                    )}
                </div>
                {!loading && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="icon" onClick={() => filePickerRef.current.click()}>
                                <PhotographIcon className="text-[#1d9bf0] h-[22px]" />
                                <input type="file" ref={filePickerRef} hidden onChange={addImageToPost} />
                            </div>
                            <div className="icon rotate-90">
                                <ChartBarIcon className="text-[#1d9bf0] h-[22px]" />
                            </div>

                            {/* <div className="icon" onClick={() => setShowEmojis(!showEmojis)}>
<EmojiHappyIcon className="text-[#1d9bf0] h-[22px]" />
</div> */}

                            <div className="icon">
                                <CalendarIcon className="text-[#1d9bf0] h-[22px]" />
                            </div>

                        </div>
                        <button
                            className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
                            disabled={!input.trim() && !selectedFile}
                            onClick={sendPost}
                        >
                            Tweet
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Input;
