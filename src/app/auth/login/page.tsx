"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 text-blue-800">Sign in to RecipeMaster</h1>
        <button
          onClick={() => signIn("google")}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow hover:bg-blue-700 transition"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
              <path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.453 3.648-5.617 3.648-3.383 0-6.148-2.797-6.148-6.25s2.765-6.25 6.148-6.25c1.922 0 3.211.82 3.953 1.523l2.703-2.633c-1.703-1.57-3.906-2.523-6.656-2.523-5.523 0-10 4.477-10 10s4.477 10 10 10c5.742 0 9.547-4.023 9.547-9.695 0-.652-.07-1.148-.156-1.547z" fill="#fff"/>
              <path d="M12.04 22c2.7 0 4.963-.89 6.617-2.42l-3.148-2.57c-.87.61-2.02.99-3.469.99-2.664 0-4.922-1.8-5.734-4.22h-3.203v2.65c1.646 3.25 5.09 5.57 9.937 5.57z" fill="#34A853"/>
              <path d="M6.306 13.78c-.2-.6-.316-1.24-.316-1.78s.116-1.18.316-1.78v-2.65h-3.203c-.65 1.3-1.02 2.74-1.02 4.43s.37 3.13 1.02 4.43l3.203-2.65z" fill="#FBBC05"/>
              <path d="M21.805 10.023h-9.765v3.977h5.617c-.242 1.242-1.453 3.648-5.617 3.648-3.383 0-6.148-2.797-6.148-6.25s2.765-6.25 6.148-6.25c1.922 0 3.211.82 3.953 1.523l2.703-2.633c-1.703-1.57-3.906-2.523-6.656-2.523-5.523 0-10 4.477-10 10s4.477 10 10 10c5.742 0 9.547-4.023 9.547-9.695 0-.652-.07-1.148-.156-1.547z" fill="#4285F4"/>
              <path d="M12.04 22c2.7 0 4.963-.89 6.617-2.42l-3.148-2.57c-.87.61-2.02.99-3.469.99-2.664 0-4.922-1.8-5.734-4.22h-3.203v2.65c1.646 3.25 5.09 5.57 9.937 5.57z" fill="none"/>
            </g>
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
} 