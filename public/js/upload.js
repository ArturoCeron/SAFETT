/*FilePond.registerPlugin(
    FilePondPluginFileValidateType,
    FilePondPluginImageExifOrientation,
    FilePondPluginImagePreview,
    FilePondPluginImageCrop,
    FilePondPluginImageResize,
    FilePondPluginImageTransform,
    FilePondPluginImageEdit
);*/
FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginImageTransform
  );
const inputElement = document.querySelector('input[type="file"]');
const pond = FilePond.create(inputElement, {
    imageResizeTargetWidth: 256,
    
    onaddfile:(err,fileItem)=>{
        console.log(err, fileItem.getMetadata('resize'))
    },

    onpreparefile:(fileItem, output) => {
        const img = new Image();
        img.src = URL.createObjectURL(output);
        document.body.appendChild(img);
    }
  
  });

/*FilePond.create(
    document.getElementById('input_photo'),
    {
        labelIdle: `Arrastra y suelta tu foto o <span class="filepond--label-action">busca</span>`,
        imagePreviewHeight: 170,
        imageCropAspectRatio: '1:1',
        imageResizeTargetWidth: 200,
        imageResizeTargetHeight: 200,
        stylePanelLayout: 'compact circle',
        styleLoadIndicatorPosition: 'center bottom',
        styleProgressIndicatorPosition: 'right bottom',
        styleButtonRemoveItemPosition: 'left bottom',
        styleButtonProcessItemPosition: 'right bottom',
    }
);*/


//FilePond.parse(document.body);