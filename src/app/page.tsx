'use client'
import { Suspense, useState, useTransition } from "react";
import { useMutation } from "@tanstack/react-query";
import { client } from "@/lib/eden";
import { useRouter, useSearchParams } from "next/navigation";
import { useUsername } from "@/hooks/use-username";
import { Loader2Icon } from "lucide-react";

const Page = () => {
  return (
    <Suspense>
      <Lobby />
    </Suspense>
  );
};

function Lobby() {
  const { username } = useUsername();
  const router = useRouter();
  const [StartTransition,SetTransiton]=useTransition()
  const searchParams = useSearchParams();
  const wasDestroyed = searchParams.get("destroyed") === "true";
  const error = searchParams.get("error");

  const [joinRoomId, setJoinRoomId] = useState("");

  const { mutate: createRoom,isPending } = useMutation({
    mutationFn: async () => {
      const res = await client.room.create.post();
      if (res.status === 200) {
        router.push(`/room/${res.data?.roomId}`);
      }
    },
  });

  const handleJoin = () => {
    SetTransiton(()=>{
      const trimmed = joinRoomId.trim();
      if (!trimmed) return;
      // Navigating to /room/:roomId triggers the proxy/middleware which
      // checks Redis to verify that the roomId is valid and not full.
      router.push(`/room/${trimmed}`);
    })
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {wasDestroyed && (
          <div className="bg-red-950/50 border border-red-900 p-4 text-center">
            <p className="text-red-500 text-sm font-mono font-bold">
              ROOM DESTROYED
            </p>
            <p className="text-zinc-500 text-xs mt-1">
              All messages were permanently deleted.
            </p>
          </div>
        )}

        {(error === "room-expired" || error === "room-not-found") && (
          <div className="bg-red-950/50 border border-red-900 p-4 text-center">
            <p className="text-red-500 text-sm font-mono font-bold uppercase">
              ROOM not found
            </p>
            <p className="text-zinc-500 text-xs mt-1">
              This room may have never existed or has expired.
            </p>
          </div>
        )}

        {error === "room-full" && (
          <div className="bg-red-950/50 border border-red-900 p-4 text-center">
            <p className="text-red-500 text-sm font-mono font-bold uppercase">
              ROOM full
            </p>
            <p className="text-zinc-500 text-xs mt-1">
              This room is already full.
            </p>
          </div>
        )}

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-green-500">
            {">"}private_chat
          </h1>
          <p className="text-zinc-500 text-sm">
            A private, self destructing chat room
          </p>
        </div>

        {/* Identity + Create room */}
        <div className="border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md space-y-6">
          <div className="space-y-2">
            <label className="flex items-center text-zinc-500">
              Your Identity
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1 border bg-zinc-950 border-zinc-800 p-3 text-sm text-zinc-400 font-mono">
                {username}
              </div>
            </div>
          </div>
          <button
            disabled={isPending}
            className="w-full bg-zinc-100 text-black p-3 text-sm font-bold
              hover:bg-zinc-50 hover:text-green-500 transition-colors
              mt-2 cursor-pointer disabled:opacity-50
              flex items-center justify-center"
            onClick={() => createRoom()}
          >
            {
              isPending?(
                <Loader2Icon className="animate-spin"/>
              ):(
                <div>
                  Create Room
                </div>
              )
            }
          </button>
        </div>

        {/* Join existing room by ID (mobile-friendly) */}
        <div className="border border-zinc-800 bg-zinc-900/50 p-6 backdrop-blur-md space-y-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-zinc-200">
              Join an existing room
            </p>
            <p className="text-xs text-zinc-500">
              Paste the room ID you received to join from another device.
            </p>
          </div>
          <div className="gap-3 sm:flex-row sm:items-center grid grid-cols-2 ">
            <input
              value={joinRoomId}
              onChange={(e) => setJoinRoomId(e.target.value)}
              placeholder="Enter room ID"
              className="w-full bg-black border border-zinc-700 focus:border-zinc-500 focus:outline-none text-zinc-100 placeholder:text-zinc-600 py-2.5 px-3 text-sm rounded-sm"
              inputMode="text"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
            />
            <button
              onClick={handleJoin}
              disabled={!joinRoomId.trim()}
              className="flex items-center justify-center w-full sm:w-auto bg-zinc-100 text-black px-4 py-2.5 text-sm font-bold hover:bg-zinc-50 hover:text-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {
                StartTransition?(
                  <Loader2Icon className="animate-spin"/>
                ):(
                  <div>
                    Join Room
                  </div>
                )
              }
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Page;

