#pragma once
#include "BinSearchTree.h"
#include "BinTree.h"
#include <functional>

template<typename T>
class AVLTreeNode : public BinTreeNode<T> {
public:
  int height = 1;
  AVLTreeNode<T>*& lhs() { return (AVLTreeNode<T>*&)(this->branches[0]); }
  AVLTreeNode<T>*& rhs() { return (AVLTreeNode<T>*&)(this->branches[1]); }

  AVLTreeNode(T new_data) {
    BinTreeNode<T>::TreeNode::data = new_data;
  }
  virtual AVLTreeNode<T>* clone() override {
    std::vector<TreeNode<T>*> cloned_branches;
    for (auto& i : BinTreeNode<T>::TreeNode::branches) {
      if (i) cloned_branches.push_back(static_cast<AVLTreeNode<T>*>(i)->clone());
      else cloned_branches.push_back(nullptr);
    }
    AVLTreeNode<T>* cloned_node =
      new AVLTreeNode<T>(this->data);
    static_cast<TreeNode<T>*>(cloned_node)->branches = cloned_branches;
    cloned_node->id = BinTreeNode<T>::TreeNode::id;
    cloned_node->height = height;
    return cloned_node;
  }
};

template<typename T>
class AVLTree : public BinSearchTree<T> {
  using nodeptr = AVLTreeNode<T>*;
public:
  nodeptr& getRoot() {
    return (nodeptr&)this->root;
  }

  std::function<void(nodeptr node)> on_balance = [](nodeptr) {};

  static int bf(nodeptr node) {
    return height(node->rhs()) - height(node->lhs());
  }
  void fixHeight(nodeptr node) {
    node->height = 1 + std::max(height(node->rhs()), height(node->lhs()));
  }
private:
  static int height(nodeptr node) {
    return node ? node->height : 0;
  }
  void fixHeight(nodeptr a, nodeptr b) {
    fixHeight(a); fixHeight(b);
  }
  nodeptr rrotAVL(nodeptr node) {
    nodeptr tmp = static_cast<nodeptr>(BinSearchTree<T>::rrot(static_cast<BinTreeNode<T>*>(node)));
    fixHeight(node, tmp);
    return tmp;
  }
  nodeptr lrotAVL(nodeptr node) {
    nodeptr tmp = static_cast<nodeptr>(BinSearchTree<T>::lrot(static_cast<BinTreeNode<T>*>(node)));
    fixHeight(node, tmp);
    return tmp;
  }
  nodeptr balance(nodeptr node) {
    fixHeight(node);
    on_balance(node);
    if (bf(node) == 2) {
      if (bf(node->rhs()) < 0)
        node->rhs() = (rrotAVL(node->rhs()));
      return lrotAVL(node);
    } else if (bf(node) == -2) {
      if (bf(node->lhs()) > 0)
        node->lhs() = (lrotAVL(node->lhs()));
      return rrotAVL(node);
    }
    return node;
  }


  nodeptr insert(nodeptr node, T insert_data) {
    if (!node) {
      this->last_inserted_node = new AVLTreeNode<T>(insert_data);
      return static_cast<nodeptr>(this->last_inserted_node);
    }
    this->on_insert(node);
    if (insert_data < node->data)
      node->lhs() = insert(node->lhs(), insert_data);
    else if (insert_data > node->data)
      node->rhs() = insert(node->rhs(), insert_data);
    else
      return node;
    this->on_insert_place_found();
    return balance(node);
  }
  nodeptr minValueNode(nodeptr node) {
    nodeptr current = node;
    while (current->lhs() != nullptr)
      current = current->lhs();
    return current;
  }

public: nodeptr deleteNode(nodeptr node, T new_data) {
  if (node == nullptr) return node;

  if (new_data < node->data)
    node->lhs() = deleteNode(node->lhs(), new_data);
  else if (new_data > node->data)
    node->rhs() = deleteNode(node->rhs(), new_data);
  else {
    if ((node->lhs() == nullptr) ||
      (node->rhs() == nullptr)) {
      nodeptr temp = node->lhs() ?
        node->lhs() :
        node->rhs();
      if (temp == nullptr) {
        temp = node;
        node = nullptr;
      } else {
        *node = *temp;
        free(temp);
      }
    } else {
      nodeptr temp = minValueNode(node->rhs());
      node->data = temp->data;
      node->rhs() = (deleteNode(node->rhs(), temp->data));
    }
  }

  if (node == nullptr)
    return node;

  node->height = 1 + std::max(height(node->lhs()), height(node->rhs()));

  int balance = bf(node);

  if (balance > 1 && bf(node->lhs()) >= 0)
    return rrotAVL(node);

  if (balance > 1 && bf(node->lhs()) < 0) {
    node->lhs() = lrotAVL(node->lhs());
    return rrotAVL(node);
  }

  if (balance < -1 && bf(node->rhs()) <= 0)
    return lrotAVL(node);

  if (balance < -1 &&
    bf(node->rhs()) > 0) {
    node->rhs() = rrotAVL(node->rhs());
    return lrotAVL(node);
  }

  return node;
}

public:
  virtual void insert(T insert_data) override {
    this->last_inserted_node = nullptr;
    getRoot() = insert(getRoot(), insert_data);
  }
  nodeptr remove(T remove_data) {
    getRoot() = deleteNode(getRoot(), remove_data);
  }
};