"use client";

import { MouseEvent, useCallback, useState } from "react";
import CustomNode from "./CustomNode";
import Button from "./Button";
import ContextMenu from "./ContextMenu";
import {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  MiniMap,
  Node,
  useEdgesState,
  useNodesState,
  ReactFlow,
  OnSelectionChangeFunc,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const initialNodes = [
  {
    id: "1",
    data: { label: "Input Node 1" },
    position: { x: 0, y: 0 },
    type: "label",
  },
] as Node[];

const nodeTypes = {
  label: CustomNode,
};

interface ICoordinates {
  x: number;
  y: number;
}

export default function ReactFlowComponent() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [id, setId] = useState(2);

  const [selectedNodes, setSelectedNodes] = useState<Node[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<Edge[]>([]);

  const [menuOpened, setMenuOpened] = useState<boolean>(false);
  const [menuCoor, setMenuCoor] = useState<ICoordinates>({ x: 0, y: 0 });

  const onConnect = useCallback(
    (params: Connection) => setEdges((edg) => addEdge(params, edg)),
    [setEdges]
  );

  const onAdd = () => {
    setId((id) => id + 1);
    
    const newNode = {
      id: id.toString(),
      data: { label: `Input Node ${id}` },
      position: { x: 0, y: 0 },
      type: "label",
    } as Node;

    setNodes((nodes: Node[]) => nodes.concat(newNode));
  };

  const onNodeContextMenu = useCallback((e: MouseEvent, node: Node) => {
    e.preventDefault();

    setMenuCoor({
      x: e.clientX,
      y: e.clientY,
    });

    setSelectedNodes((nodes) => [...nodes, node]);

    setMenuOpened(true);
  }, []);

  const onClickDelete = () => {
    if (!selectedNodes.length && !selectedEdges.length) return;

    setEdges((edges) =>
      edges.filter(
        (edge: Edge) => !selectedEdges.find((selEdge) => selEdge.id === edge.id)
      )
    );

    selectedNodes.forEach((selectedNode) => {
      setNodes((nodes) => nodes.filter((node) => node.id !== selectedNode.id));

      setEdges((edges) =>
        edges.filter(
          (edge: Edge) =>
            edge.source !== selectedNode.id && edge.target !== selectedNode.id
        )
      );
    });

    setMenuOpened(false);
  };

  const onNodeSelectionChange: OnSelectionChangeFunc<Node> = (params) => {
    setSelectedNodes(params.nodes);
    setSelectedEdges(params.edges);
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      onNodeContextMenu={onNodeContextMenu}
      onSelectionChange={onNodeSelectionChange}
      defaultEdgeOptions={{
        type: "custom-edge",
        label: "Edge",
      }}
      onMove={() => setMenuOpened(false)}
      colorMode="dark"
      fitView
    >
      <Background />
      <div className="absolute left-1/2 bottom-8 -translate-x-1/2 flex justify-between gap-2 z-10 p-2 py-1 border border-neutral-800 rounded-full bg-neutral-800/50">
        <Button
          onClick={onAdd}
          classname="w-11 aspect-square rounded-full"
          text="+"
        />
        <Button
          onClick={onClickDelete}
          classname="w-11 aspect-square rounded-full"
          text="-"
        />
      </div>
      <MiniMap position="bottom-right" />
      <Controls />
      <ContextMenu
        isOpened={menuOpened}
        x={menuCoor.x}
        y={menuCoor.y}
        onClose={() => setMenuOpened(false)}
      >
        <li
          className="cursor-pointer text-center w-full py-4 hover:bg-neutral-800/50"
          onClick={onClickDelete}
        >
          🗑️ Supprimer
        </li>
      </ContextMenu>
    </ReactFlow>
  );
}
