const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    let selectedElement = null;
    const canvas = document.getElementById('canvas');
    const placeholder = canvas.querySelector('.placeholder');

    // Setup drag for desktop only
    if (!isTouchDevice) {
      document.querySelectorAll('.element').forEach(el => {
        el.addEventListener('dragstart', e => {
          e.dataTransfer.setData('type', e.target.dataset.type);
        });
      });
    }

    // Add click-to-add for mobile (and desktop if wanted)
    document.querySelectorAll('.element').forEach(el => {
      el.addEventListener('click', () => {
        if (isTouchDevice) {
          addElementToCanvas(el.dataset.type);
        }
      });
    });

    // Handle drop event (desktop)
    function handleDrop(e) {
      e.preventDefault();
      const type = e.dataTransfer.getData('type');
      addElementToCanvas(type);
    }

    // Add element helper
    function addElementToCanvas(type) {
      if (placeholder) placeholder.style.display = 'none';

      let newEl;
      if (type === 'text') {
        newEl = document.createElement('p');
        newEl.textContent = 'Edit me';
      } else if (type === 'image') {
        newEl = document.createElement('img');
        newEl.src = 'https://via.placeholder.com/150';
        newEl.style.maxWidth = '100%';
        newEl.style.height = 'auto';
      } else if (type === 'button') {
        newEl = document.createElement('button');
        newEl.textContent = 'Click Me';
      }

      if (newEl) {
        newEl.classList.add('editable');
        newEl.style.position = 'relative';
        newEl.style.margin = '5px 0';

        // Make elements clickable/selectable
        newEl.addEventListener('click', e => {
          e.stopPropagation(); // prevent canvas deselect
          selectElement(newEl);
        });

        canvas.appendChild(newEl);
        selectElement(newEl);
      }
    }

    // Deselect on clicking canvas background
    canvas.addEventListener('click', () => {
      if (selectedElement) {
        selectedElement.classList.remove('selected');
        selectedElement = null;
        clearForm();
      }
    });

    // Select element and populate form
    function selectElement(el) {
      document.querySelectorAll('.editable').forEach(elem => elem.classList.remove('selected'));
      el.classList.add('selected');
      selectedElement = el;
      populateForm(el);
    }

    // Clear form fields
    function clearForm() {
      const form = document.getElementById('dynamic-fields');
      form.innerHTML = '';
    }

    // Populate form inputs based on element type
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
        form.innerHTML += `<label>Link (href)</label><input name="href" value="${el.dataset.href || ''}" placeholder="Optional" />`;
      }
    }

    // Apply form changes to selected element
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
        const href = data.get('href');
        selectedElement.dataset.href = href;
        // Optional: make button clickable if href provided
        if (href) {
          selectedElement.onclick = () => window.open(href, '_blank');
        } else {
          selectedElement.onclick = null;
        }
      }
    });