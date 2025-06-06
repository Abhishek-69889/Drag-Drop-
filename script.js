let selectedElement = null;

    document.querySelectorAll('.element').forEach(el => {
      el.addEventListener('dragstart', e => {
        e.dataTransfer.setData('type', e.target.dataset.type);
      });
    });

    function handleDrop(e) {
      const type = e.dataTransfer.getData('type');
      let newEl;
      if (type === 'text') {
        newEl = document.createElement('p');
        newEl.textContent = 'Edit me';
      } else if (type === 'image') {
        newEl = document.createElement('img');
        newEl.src = 'https://via.placeholder.com/150';
        newEl.style.maxWidth = '100%';
      } else if (type === 'button') {
        newEl = document.createElement('button');
        newEl.textContent = 'Click Me';
      }

      if (newEl) {
        newEl.classList.add('editable');
        newEl.style.position = 'relative';
        newEl.addEventListener('click', () => selectElement(newEl));
        e.target.appendChild(newEl);
        selectElement(newEl);
      }
    }

    function selectElement(el) {
      document.querySelectorAll('.editable').forEach(el => el.classList.remove('selected'));
      el.classList.add('selected');
      selectedElement = el;
      populateForm(el);
    }

    function populateForm(el) {
      const form = document.getElementById('dynamic-fields');
      form.innerHTML = '';
      if (el.tagName === 'P') {
        form.innerHTML += `<label>Text</label><textarea name="text">${el.textContent}</textarea>`;
        form.innerHTML += `<label>Font Size</label><input name="fontSize" value="${el.style.fontSize || ''}" placeholder="e.g. 20px" />`;
        form.innerHTML += `<label>Color</label><input name="color" type="color" value="${el.style.color || '#000000'}" />`;
      } else if (el.tagName === 'IMG') {
        form.innerHTML += `<label>Image URL</label><input name="src" value="${el.src}" />`;
        form.innerHTML += `<label>Width</label><input name="width" value="${el.style.width || ''}" placeholder="e.g. 100px or 50%" />`;
      } else if (el.tagName === 'BUTTON') {
        form.innerHTML += `<label>Button Text</label><input name="text" value="${el.textContent}" />`;
        form.innerHTML += `<label>Link (href)</label><input name="href" value="${el.dataset.href || ''}" />`;
      }
    }

    document.getElementById('property-form').addEventListener('submit', e => {
      e.preventDefault();
      if (!selectedElement) return;
      const data = new FormData(e.target);
      if (selectedElement.tagName === 'P') {
        selectedElement.textContent = data.get('text');
        selectedElement.style.fontSize = data.get('fontSize');
        selectedElement.style.color = data.get('color');
      } else if (selectedElement.tagName === 'IMG') {
        selectedElement.src = data.get('src');
        selectedElement.style.width = data.get('width');
      } else if (selectedElement.tagName === 'BUTTON') {
        selectedElement.textContent = data.get('text');
        selectedElement.dataset.href = data.get('href');
      }
    });