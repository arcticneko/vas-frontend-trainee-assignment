'use strict';

import domtoimage from 'dom-to-image';

const FILE_TYPES = [`jpg`, `jpeg`, `png`, `gif`];

const banner = document.querySelector('.banner-container__banner')
const descriptionSource = document.querySelector('.controls-menu__control-input--text')
const widthField = document.getElementById('width');
const heightField = document.getElementById('height');
const colorField = document.getElementById('color');
const downloadLink = document.querySelector('.download-png');

const createDescription = function (valueFrom, output) {
  if (document.querySelector('.banner-container__description')) {
    document.querySelector('.banner-container__description').textContent = descriptionSource.value
  }
  else {
    const description = document.createElement('span');

    description.classList.add('banner-container__description');
    description.textContent = valueFrom.value;
    description.setAttribute('style', `position: absolute; left: 0; bottom: 16px; word-break: break-all; position: absolute; width: 100%; height: 64px;
    overflow: hidden; box-sizing: border-box; padding: 0 11px 0 14px; font-weight: 700; font-size: 18px; line-height: 21px; color: rgb(255,255,255);
    text-align: left; white-space: pre-line;`
    );
    output.appendChild(description);
  }
}

const setBannerColor = function (colorElem, banner) {
  banner.style.backgroundColor = colorElem.value;
}

const setBannerImage = function (input, output) {
  input.addEventListener(`change`, function () {
    const file = input.files[0];
    const fileName = file.name.toLowerCase();

    const matches = FILE_TYPES.some(function (ending) {
      return fileName.endsWith(ending);
    });

    if (matches) {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.addEventListener(`load`, function () {
        if (document.querySelector('.banner-container__background')) {
          document.querySelector('.banner-container__background').src = reader.result;
        } else {
          const newElement = document.createElement(`img`);

          newElement.classList.add('banner-container__background');
          newElement.setAttribute('style', `position: absolute; top: 10px; right: 10px;`)
          newElement.src = reader.result;
          output.appendChild(newElement);
        }
      });
    }
  });
};


const htmlToJson = function (elem) {
  const tag = {};
  // debugger 
  
  tag['tagName'] = elem.tagName;
  tag['children'] = [];

  for (let nestedElem = 0; nestedElem < elem.children.length; nestedElem++) {
    tag['children'].push(htmlToJson(elem.children[nestedElem]));
  }
  
  //base case
  for (let attribute = 0; attribute < elem.attributes.length; attribute++) {
    const attr = elem.attributes[attribute];
    tag['@' + attr.name] = attr.value;
    
    if (attr.value === 'banner-container__description') {
      tag['#' + 'text'] = elem.textContent;
    }
  }

  return tag;
}

setBannerImage(document.getElementById('banner-item'), banner)

/* Event listeners */

colorField.addEventListener('input', () => {
  setBannerColor(colorField, banner);
})

descriptionSource.addEventListener('input', () => {
  createDescription(descriptionSource, banner)
})

widthField.addEventListener('input', () => {
  banner.style.width = `${widthField.value}px`;
})

heightField.addEventListener('input', () => {
  banner.style.height = `${heightField.value}px`;
})

/* Save as */

document.getElementById('to-png').addEventListener('click', function () { // переносим сюда то что отдает канвас
  domtoimage.toPng(banner)
    .then(function (dataUrl) {
      let img = new Image();

      img.classList.add('showcase')
      img.src = dataUrl;

      document.body.appendChild(img);

      downloadLink.href = dataUrl;
      downloadLink.click();
    })
    .catch(function (error) {
      console.error('Error while rendering as PNG:', error);
    });
});

document.getElementById('to-html').addEventListener('click', function () {
  document.getElementById('copied-results').value = document.getElementById('banner-container').innerHTML;
  navigator.clipboard.writeText(document.getElementById('banner-container').innerHTML);
});

document.getElementById('to-json').addEventListener('click', function () {
  document.getElementById('copied-results').value = `${JSON.stringify(htmlToJson(document.getElementById('banner')))}`;
  navigator.clipboard.writeText(JSON.stringify(htmlToJson(document.getElementById('banner'))));
});
