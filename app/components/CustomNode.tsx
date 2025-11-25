"use client";

import { Handle, Node, NodeProps, Position } from "@xyflow/react";

type TextNode = Node<{ label: string }, "text">;

const CustomNode = ({ data, isConnectable, selected }: NodeProps<TextNode>) => {
  return (
    <>
      <div
        className={`px-6 py-2 bg-neutral-700/20 rounded backdrop-blur-[1px] border ${
          selected ? "border-blue-600/50" : "border-neutral-700"
        }`}
      >
        <div>{data.label}</div>
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
        />
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
        />
      </div>
    </>
  );
};

export default CustomNode;
