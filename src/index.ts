console.log('Hii');

addItem('Hii');

function addItem(data: any) {
    var node = document.createElement('li');
    var textNode = document.createTextNode(data);
    node.appendChild(textNode);
    document.getElementById('list').appendChild(node);
}