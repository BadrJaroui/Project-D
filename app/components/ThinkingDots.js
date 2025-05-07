export default function ThinkingDots() {
    return (
        <div className="flex space-x-1">
            <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: "0s" }}></span>
            <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
            <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: "0.4s" }}></span>
        </div>
    );
}