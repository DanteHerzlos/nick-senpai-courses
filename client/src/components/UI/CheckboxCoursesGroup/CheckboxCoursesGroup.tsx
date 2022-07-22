import { Checkbox, Col, Divider, Row } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import React, { useEffect, useState } from 'react'

interface ICheckboxOptions {
  label: string
  value: string
}

interface CheckboxCoursesGroupProps{
  checkboxOptions: ICheckboxOptions[]
  setButtonDisable: (isDisable: boolean) => void
  courses: string[]
  setCourses: (courses: string[]) => void
}

const CheckboxCoursesGroup:React.FC<CheckboxCoursesGroupProps> = ({
  checkboxOptions, setButtonDisable, courses, setCourses
}) => {
  const [ checkAll, setCheckAll ] = useState<boolean>(false)
  const [ indeterminate, setIndeterminate ] = useState<boolean>(true)

  useEffect(() => {
    setIndeterminate(
      !!courses.length && 
      courses.length < checkboxOptions.length
    )
  }, [courses])

  const checkboxChangeHandler = (checkedValues: string[]) => {
    setButtonDisable(false)
    setCourses(checkedValues)   
    setIndeterminate(
      !!checkedValues.length && 
      checkedValues.length < checkboxOptions.length
    )
    setCheckAll(checkedValues.length === checkboxOptions.length)
  }

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    setButtonDisable(false)
    setCourses(e.target.checked ? checkboxOptions.map(c => c.value) : [])
    setIndeterminate(false)
    setCheckAll(e.target.checked)
  }

  return (
  <>
    <Checkbox
      indeterminate={indeterminate} 
      onChange={onCheckAllChange} 
      checked={checkAll}
    >
      Выбрать все
    </Checkbox>
    <Divider/>
    <Checkbox.Group value={courses} onChange={checkboxChangeHandler}>
      <Row>
        {checkboxOptions && checkboxOptions.map(name => {return (
          <Col key={name.value} sm={8} xs={24}>
            <Checkbox value={name.value}>{name.label}</Checkbox>
          </Col>
        )})}
      </Row>
    </Checkbox.Group>
  </>
  )
}

export default CheckboxCoursesGroup