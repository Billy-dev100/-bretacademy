// (function toc(){
//   const tocNav = elem(`#TableOfContents`);
//   if(tocNav) {
//     pushClass(tocNav, 'toc');
//     const listLinks = elems('a', tocNav);
//     listLinks.forEach(function(link){
//       console.log(link);
//     });
//   }
// })();

const tableOfContents = elem('#TableOfContents');

function getLinkId(link) {
  link = link.href;
  let truncateEnd = link.length - 1;
  let truncateStart = link.indexOf('#');
  const id = link.substr(truncateStart, truncateEnd);
  return id
}

(function supportTopics() {
  const topicTitle = '.topic_title';
  const heading = 'topic_heading';
  const topicOpen = 'topic_open';
  let topics = elems('.topic');
  if (topics) {
    topics.forEach(function(topic){
      let topicItems = topic.children
      let firstTopicTitle = topicItems[0];
      pushClass(firstTopicTitle, topicOpen)
      let previous = topic.previousElementSibling;
      let hasHeading = previous.matches('h2');
      hasHeading ? pushClass(previous, heading) : false; 
      let id = hasHeading ? previous.id : false; 
      
      let tocLinks = Array.from(elems('a', tableOfContents));
      let actionableLink = tocLinks.filter(function(link){
        let linkId = getLinkId(link);
        return linkId == `#${id}`;
      })[0];
      
      actionableLink.dataset.items = topicItems.length / 2;
      pushClass(actionableLink, 'toc_tally');
    });
    
  }
  
  page.addEventListener('click', function(event){
    let target = event.target
    let isActionable = target.matches(topicTitle);
    if(isActionable) {
      let openTopic = Array.from(target.parentNode.children).filter(function(sibling){
        return sibling.matches(`.${topicOpen}`);
      });
      modifyClass(openTopic[0], topicOpen);
      openTopic[0] == target ? false :  modifyClass(target, topicOpen);
    }
  })
})();

if(tableOfContents) {
  pushClass(tableOfContents, 'toc');
  const listItems = Array.from(elems('li', tableOfContents));
  
  listItems.forEach(function(item){
    hasNestedList = elem('ul', item) ? true : false;
    hasNestedList ? pushClass(item, 'toc_hassub') : false;
  })
  
  const listLinks = Array.from(elems('a', tableOfContents));
  const listIds = listLinks.map(function(link){
    const id = getLinkId(link);
    return id
  });
  
  let tocPositions = Object.create(null);
  let flatPositions = []
  
  listIds.map(function(id){
    let heading = elem(id);
    let offset = heading.offsetTop
    tocPositions[id] = offset;
    flatPositions.push(offset);
  });
  
  
  listLinks.forEach(function(link){
    pushClass(link, 'toc_item');
    const id = getLinkId(link);
    link.dataset.position = tocPositions[id]
  });
  
  page.addEventListener('click', function(event){
    let target = event.target;
    let navHeight = elem('.nav_wrap').offsetHeight + 12;
    if(target.matches('.toc_item')){
      setTimeout(function(){
        let position = window.scrollY
        window.scroll({
          top: (position - navHeight),
          behavior: 'smooth'
        });
      }, 500);
    }
  });
  function closestInt(goal, collection) {
    const closest = collection.reduce(function(prev, curr) {
      return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
    });
    return closest
  }
  
  function activeHeading(position) {
    let active = 'toc_active';
    const toModify = listLinks.filter(function(link){
      let currentHeading = containsClass(link, active);
      let newPosition = parseInt(link.dataset.position)
      return newPosition === position || currentHeading
    });
    
    const changeHeading = (toModify.length > 1)
    
    if (changeHeading) {
      toModify.forEach(function(link){
        modifyClass(link, active)
      });
    } else {
      let targetHeading = toModify[0];
      containsClass(targetHeading, active) ? false : pushClass(targetHeading, active);
    }
  };
  
  window.addEventListener('scroll', function(e) {
    // this.setTimeout(function(){
    let position = window.scrollY;
    let active = closestInt(position, flatPositions);
    activeHeading(active);
    // }, 1500)
  });
  
}
