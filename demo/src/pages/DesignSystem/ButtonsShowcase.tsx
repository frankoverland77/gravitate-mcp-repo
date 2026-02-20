import React from 'react'
import { GraviButton, BigButton, EditSaveButton, IconButton } from '@gravitate-js/excalibrr'
import { ShowcaseShell, SpecimenCard, SectionDivider } from './ShowcaseShell'

export function ButtonsShowcase() {
  return (
    <ShowcaseShell title="Buttons" subtitle="GraviButton, BigButton, EditSaveButton, IconButton" accentColor="#1890ff">
      <SectionDivider title="GraviButton — Themes" />
      <SpecimenCard label="Default" props="buttonText='Default'">
        <GraviButton buttonText="Default" onClick={() => {}} />
      </SpecimenCard>
      <SpecimenCard label="Theme 1" props="buttonText='Theme 1' theme1">
        <GraviButton buttonText="Theme 1" theme1 onClick={() => {}} />
      </SpecimenCard>
      <SpecimenCard label="Success" props="buttonText='Success' success">
        <GraviButton buttonText="Success" success onClick={() => {}} />
      </SpecimenCard>
      <SpecimenCard label="Warning" props="buttonText='Warning' warning">
        <GraviButton buttonText="Warning" warning onClick={() => {}} />
      </SpecimenCard>
      <SpecimenCard label="Error" props="buttonText='Error' error">
        <GraviButton buttonText="Error" error onClick={() => {}} />
      </SpecimenCard>
      <SpecimenCard label="Outlined" props="buttonText='Outlined' outlined">
        <GraviButton buttonText="Outlined" outlined onClick={() => {}} />
      </SpecimenCard>
      <SpecimenCard label="Disabled" props="buttonText='Disabled' disabled">
        <GraviButton buttonText="Disabled" disabled onClick={() => {}} />
      </SpecimenCard>

      <SectionDivider title="GraviButton — With Icons" />
      <SpecimenCard label="Icon + Text" props="buttonText='Add Item' icon='add'">
        <GraviButton buttonText="Add Item" icon="add" onClick={() => {}} />
      </SpecimenCard>
      <SpecimenCard label="Icon Only" props="icon='settings'">
        <GraviButton icon="settings" onClick={() => {}} />
      </SpecimenCard>

      <SectionDivider title="BigButton" />
      <SpecimenCard label="BigButton" props="title='Create New' subtitle='Start from scratch'">
        <BigButton title="Create New" subtitle="Start from scratch" onClick={() => {}} />
      </SpecimenCard>

      <SectionDivider title="EditSaveButton" />
      <SpecimenCard label="Edit Mode" props="isEditing={false}">
        <EditSaveButton isEditing={false} onEdit={() => {}} onSave={() => {}} onCancel={() => {}} />
      </SpecimenCard>
      <SpecimenCard label="Save Mode" props="isEditing={true}">
        <EditSaveButton isEditing={true} onEdit={() => {}} onSave={() => {}} onCancel={() => {}} />
      </SpecimenCard>

      <SectionDivider title="IconButton" />
      <SpecimenCard label="IconButton" props="icon='edit'">
        <IconButton icon="edit" onClick={() => {}} />
      </SpecimenCard>
    </ShowcaseShell>
  )
}
