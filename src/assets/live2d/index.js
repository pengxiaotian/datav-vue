require('./live2d.min.js')

window.addEventListener('load', () => {
  const apiPath = 'https://live2d.fghrsh.net/api',
    modelId = localStorage.getItem('modelId') || '1',
    modelTexturesId = localStorage.getItem('modelTexturesId') || '53'

  let state = 0

  loadModel(modelId, modelTexturesId)

  function loadModel(modelId, modelTexturesId) {
    localStorage.setItem('modelId', modelId)

    if (modelTexturesId === undefined) {
      modelTexturesId = '0'
    }

    localStorage.setItem('modelTexturesId', modelTexturesId)

    loadlive2d('live2d', `${apiPath}/get/?id=${modelId}-${modelTexturesId}`, null)

    // console.log('live2d', `模型 ${modelId}-${modelTexturesId} 加载完成`)

    setTimeout(() => {
      coverPosition('80%')
      state = 2
    }, 2000)
  }

  // function loadRandModel() {
  //   const modelId = localStorage.getItem('modelId') || '1',
  //     modelTexturesId = localStorage.getItem('modelTexturesId')

  //   fetch(`${apiPath}/rand_textures/?id=${modelId}-${modelTexturesId}`)
  //     .then(response => response.json())
  //     .then(result => {
  //       loadModel(modelId, result.textures.id)
  //       setTimeout(() => {
  //         state = 2
  //         coverPosition('80%')
  //         document.getElementById('refresh')!.setAttribute('href', 'javascript:refresh()')
  //       }, 1000)
  //     })
  // }

  function coverPosition(pos) {
    document.getElementById('cover').style.bottom = pos
  }

  // window.refresh = function() {
  //   state = 0
  //   coverPosition('10%')
  //   document.getElementById('refresh')!.setAttribute('href', 'javascript:void(0)')
  //   setTimeout(loadRandModel, 1000)
  // }

  document.getElementById('handle').addEventListener('click', () => {
    if (state === 1) {
      state = 2
      coverPosition('80%')
    }
    else if (state === 2) {
      state = 1
      coverPosition('20%')
    }
  })

  document.querySelector('input[type=password]').addEventListener('focus', () => {
    if (state === 2) {
      state = 1
      coverPosition('20%')
    }
  })
  document.querySelector('input[type=password]').addEventListener('blur', () => {
    if (state === 1) {
      state = 2
      coverPosition('80%')
    }
  })
})
