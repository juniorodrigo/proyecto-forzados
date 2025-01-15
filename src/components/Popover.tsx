import React from "react";

interface PopoverProps {
	message: string;
	type: "success" | "error";
	show: boolean;
	className?: string;
}

const Popover: React.FC<PopoverProps> = ({ message, type, show, className }) => {
	if (!show) return null;
	return (
		<div
			className={`z-50 fixed top-10 left-1/2 transform -translate-x-1/2 transition-transform ${type === "success" ? "bg-green-500" : "bg-red-500"} ${className}`}
			style={{ transition: "transform 0.5s ease-out" }}
		>
			<div className="text-white text-center py-2 px-4 rounded-lg shadow-lg">{message}</div>
		</div>
	);
};

export default Popover;
