import { Node, NodeViewProps, mergeAttributes } from "@tiptap/core";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";

import ImageSkeleton from "@/skeletons/image-skeleton";

export const SkeletonNode = Node.create({
  name: "skeleton",

  group: "block",
  atom: true,

  parseHTML() {
    return [{ tag: "div[data-type='skeleton']" }];
  },

  addAttributes() {
    return {
      id: {
        default: null,
      },
    };
  },

  // Defines how to export this node back to HTML when saving
  // It outputs <div data-type="skeleton">...</div>

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "skeleton" }),
      0,
    ];
  },

  // Tells TipTap to use our skeleton component to render inside the editor
  addNodeView() {
    return ReactNodeViewRenderer(ImageSkeletonWithNodeView);
  },
});

// Added NodeViewWrapper to prevent an UploadThing error
function ImageSkeletonWithNodeView({ node }: Readonly<NodeViewProps>) {
  const { id } = node.attrs;

  return (
    <NodeViewWrapper>
      <ImageSkeleton id={id} />
    </NodeViewWrapper>
  );
}
