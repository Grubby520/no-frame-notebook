class BinaryTreeNode {
 constructor(value) {
   this.value = value;
   this.left_child = null;
   this.right_child = null;
 }
 compare(v) {
   if (this.value > v) return -1;
   if (this.value == v) return 0;
   if (this.value < v) return 1;
 }
}

class BST {
 constructor() {
   this.root_node = null;
 }
 /* 如果根节点为空（树为空），则elem将成为根节点
  如果elem低于根节点，则切换到左边的子节点，检查是否为空
  如果为空，elem将成为左子节点
  如果没有，继续沿着这条路走
  若elem高于或等于根节点，则切换到右子节点并检查它是否为空
  如果为空，elem将成为正确的子节点
  如果没有，继续沿着这条路走 */
 add(elem) {
   if (!this.root_node) {
     this.root_node = new BinaryTreeNode(elem);
     return;
   }
   let inserted = false;
   let currentNode = this.root_node;
   do {
     let comp = currentNode.compare(elem);
     if (comp == -1) {
       if (!currentNode.left_child) {
         currentNode.left_child = new BinaryTreeNode(elem);
         inserted = true;
       } else {
         currentNode = currentNode.left_child;
       }
     }
     if (comp != -1) {
       if (!currentNode.right_child) {
         currentNode.right_child = new BinaryTreeNode(elem);
         inserted = true;
       } else {
         currentNode = currentNode.right_child;
       }
     }
   } while (!inserted);
 }

 inorder(parent) {
   if (parent) {
     this.inorder(parent.left_child);
     console.log(parent.value);
     this.inorder(parent.right_child);
   }
 }

 print() {
   this.inorder(this.root_node);
 }
}

// export {
//     BinaryTreeNode,
//     BST
// }
