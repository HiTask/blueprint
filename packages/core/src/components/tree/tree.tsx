/*
 * Copyright 2015 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import classNames from "classnames";
import * as React from "react";

import * as Classes from "../../common/classes";
import { DISPLAYNAME_PREFIX, IProps } from "../../common/props";
import { isFunction } from "../../common/utils";
import { ITreeNode, TreeNode } from "./treeNode";

export type TreeEventHandler<T = {}> = (
    node: ITreeNode<T>,
    nodePath: number[],
    e: React.MouseEvent<HTMLElement>,
) => void;

export interface ITreeProps<T = {}> extends IProps {
    /**
     * The data specifying the contents and appearance of the tree.
     */
    contents: Array<ITreeNode<T>>;

    /**
     * Invoked when a node is clicked anywhere other than the caret for expanding/collapsing the node.
     */
    onNodeClick?: TreeEventHandler<T>;

    /**
     * Invoked when caret of an expanded node is clicked.
     */
    onNodeCollapse?: TreeEventHandler<T>;

    /**
     * Invoked when a node is right-clicked or the context menu button is pressed on a focused node.
     */
    onNodeContextMenu?: TreeEventHandler<T>;

    /**
     * Invoked when a node is double-clicked. Be careful when using this in combination with
     * an `onNodeClick` (single-click) handler, as the way this behaves can vary between browsers.
     * See http://stackoverflow.com/q/5497073/3124288
     */
    onNodeDoubleClick?: TreeEventHandler<T>;

    /**
     * Invoked when the caret of a collapsed node is clicked.
     */
    onNodeExpand?: TreeEventHandler<T>;

    /**
     * Invoked when the mouse is moved over a node.
     */
    onNodeMouseEnter?: TreeEventHandler<T>;

    /**
     * Invoked when the mouse is moved out of a node.
     */
    onNodeMouseLeave?: TreeEventHandler<T>;
}

export class Tree<T = {}> extends React.Component<ITreeProps<T>, {}> {
    public static displayName = `${DISPLAYNAME_PREFIX}.Tree`;

    public static ofType<T>() {
        return Tree as new (props: ITreeProps<T>) => Tree<T>;
    }

    public static nodeFromPath(path: number[], treeNodes: ITreeNode[]): ITreeNode {
        if (path.length === 1) {
            return treeNodes[path[0]];
        } else {
            return Tree.nodeFromPath(path.slice(1), treeNodes[path[0]].childNodes);
        }
    }

    private nodeRefs: { [nodeId: string]: HTMLElement } = {};

    public render() {
        return (
            <div className={classNames(Classes.TREE, this.props.className)}>
                {this.renderNodes(this.props.contents, [], Classes.TREE_ROOT)}
            </div>
        );
    }

    /**
     * Returns the underlying HTML element of the `Tree` node with an id of `nodeId`.
     * This element does not contain the children of the node, only its label and controls.
     * If the node is not currently mounted, `undefined` is returned.
     */
    public getNodeContentElement(nodeId: string | number): HTMLElement | undefined {
        return this.nodeRefs[nodeId];
    }

    private renderNodes(treeNodes: Array<ITreeNode<T>>, currentPath?: number[], className?: string): JSX.Element {
        if (treeNodes == null) {
            return null;
        }

        const nodeItems = treeNodes.map((node, i) => {
            const elementPath = currentPath.concat(i);
            const TypedTreeNode = TreeNode.ofType<T>();
            return (
                <TypedTreeNode
                    {...node}
                    key={node.id}
                    contentRef={this.handleContentRef}
                    depth={elementPath.length - 1}
                    onClick={this.handleNodeClick}
                    onContextMenu={this.handleNodeContextMenu}
                    onCollapse={this.handleNodeCollapse}
                    onDoubleClick={this.handleNodeDoubleClick}
                    onExpand={this.handleNodeExpand}
                    onMouseEnter={this.handleNodeMouseEnter}
                    onMouseLeave={this.handleNodeMouseLeave}
                    path={elementPath}
                >
                    {this.renderNodes(node.childNodes, elementPath)}
                </TypedTreeNode>
            );
        });

        return <ul className={classNames(Classes.TREE_NODE_LIST, className)}>{nodeItems}</ul>;
    }

    private handleNodeCollapse = (node: TreeNode<T>, e: React.MouseEvent<HTMLElement>) => {
        this.handlerHelper(this.props.onNodeCollapse, node, e);
    };

    private handleNodeClick = (node: TreeNode<T>, e: React.MouseEvent<HTMLElement>) => {
        this.handlerHelper(this.props.onNodeClick, node, e);
    };

    private handleContentRef = (node: TreeNode<T>, element: HTMLElement | null) => {
        if (element != null) {
            this.nodeRefs[node.props.id] = element;
        } else {
            // don't want our object to get bloated with old keys
            delete this.nodeRefs[node.props.id];
        }
    };

    private handleNodeContextMenu = (node: TreeNode<T>, e: React.MouseEvent<HTMLElement>) => {
        this.handlerHelper(this.props.onNodeContextMenu, node, e);
    };

    private handleNodeDoubleClick = (node: TreeNode<T>, e: React.MouseEvent<HTMLElement>) => {
        this.handlerHelper(this.props.onNodeDoubleClick, node, e);
    };

    private handleNodeExpand = (node: TreeNode<T>, e: React.MouseEvent<HTMLElement>) => {
        this.handlerHelper(this.props.onNodeExpand, node, e);
    };

    private handleNodeMouseEnter = (node: TreeNode<T>, e: React.MouseEvent<HTMLElement>) => {
        this.handlerHelper(this.props.onNodeMouseEnter, node, e);
    };

    private handleNodeMouseLeave = (node: TreeNode<T>, e: React.MouseEvent<HTMLElement>) => {
        this.handlerHelper(this.props.onNodeMouseLeave, node, e);
    };

    private handlerHelper(handlerFromProps: TreeEventHandler, node: TreeNode<T>, e: React.MouseEvent<HTMLElement>) {
        if (isFunction(handlerFromProps)) {
            const nodeData = Tree.nodeFromPath(node.props.path, this.props.contents);
            handlerFromProps(nodeData, node.props.path, e);
        }
    }
}
