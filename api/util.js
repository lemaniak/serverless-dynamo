
const fetchData = async (subsegment) => {
    const slowSubsegment = subsegment.addNewSubsegment('Slow Function')
  
    try {
      await slowFunction()
    } finally {
      slowSubsegment.close()
    }
  
    const fasterSubsegment = subsegment.addNewSubsegment('Faster Function')
  
    try {
      await fastFunction()
    } finally {
      fasterSubsegment.close()
    }
  
    const unreliableSubsegment = subsegment.addNewSubsegment('Unreliable Function')
  
    try {
      await unreliableFunction()
    } catch (err) {
      unreliableSubsegment.addError(err)
      throw err
    } finally {
      unreliableSubsegment.close()
    }
  
    return {
      message: 'hello'
    }
  }

  const slowFunction = async () => {
  await new Promise(resolve => setTimeout(resolve, 2000))
}

 const fastFunction = async () => {
  await new Promise(resolve => setTimeout(resolve, 150))
}

const unreliableFunction = async () => {
  if(Math.random() < 0.2) {
    throw new Error('Something went wrong')
  }
}

module.exports = {
  fetchData,
  slowFunction,
  fastFunction,
  unreliableFunction
}