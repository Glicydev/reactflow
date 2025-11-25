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

  const [menuOpened, setMenuOpened] = useState<boolean>(false);
  const [menuCoor, setMenuCoor] = useState<ICoordinates>({ x: 0, y: 0 });

  const selectedNodes = () => {
    return nodes.filter((node) => node.selected);
  };

  const selectedEdges = () => {
    return edges.filter((edge: Edge) => edge.selected);
  };

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

  const onNodeContextMenu = useCallback(
    (e: MouseEvent, node: Node) => {
      e.preventDefault();

      setMenuCoor({
        x: e.clientX,
        y: e.clientY,
      });

      setNodes((nds) =>
        nds.map((n) => {
          if (n.id === node.id) {
            n.selected = true;
          }

          return n;
        })
      );

      setMenuOpened(true);
    },
    [setNodes]
  );

  const onClickDelete = () => {
    const selectedNodesList = selectedNodes();
    const selectedEdgesList = selectedEdges();

    if (!selectedNodesList.length && !selectedEdgesList.length) return;

    setEdges((edges) =>
      edges.filter(
        (edge: Edge) =>
          !selectedEdgesList.find((selEdge: Edge) => selEdge.id === edge.id)
      )
    );

    selectedNodesList.forEach((selectedNode) => {
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

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      nodeTypes={nodeTypes}
      onNodeContextMenu={onNodeContextMenu}
      defaultEdgeOptions={{
        type: "custom-edge",
        label: "Edge",
        animated: true,
      }}
      onClick={() => setMenuOpened(false)}
      colorMode="dark"
      fitView
    >
      <Background />
      <div className="absolute left-1/2 bottom-8 -translate-x-1/2 flex justify-between gap-2 z-10 p-2 py-1 border border-neutral-800 rounded-full bg-neutral-900/50">
        <Button
          onClick={onAdd}
          classname="w-11 px-0! aspect-square rounded-full"
          text="+"
        />
        <Button
          onClick={onClickDelete}
          classname="rounded-full"
          text="Supprimer"
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
        <li onClick={onClickDelete}>🗑️ Supprimer</li>
        <li onClick={onClickDelete}>🗑️ Supprimer 2</li>
      </ContextMenu>
    </ReactFlow>
  );
}
