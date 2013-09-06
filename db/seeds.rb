d = User.create!( name: 'Wu-Tang Clan', email: 'wutang@wutang.com', password_digest: 'iowejfiowejfiowe3')
d.expert.update_attributes(title: "C.R.E.A.M.", company: "36 Chambers", linkedin: "www.linkedin.com/wutang", photo: "http://24.media.tumblr.com/9dbf4a799a45a9b352be5b9b6ca5f08b/tumblr_mksnoxrFXR1rguebjo1_500.jpg", active: true)
d.expert.user_id = d.id
d.expert.skills.create(tag: 'O.G.')
d.expert.skills.create(tag: 'Rapping')
d.expert.skills.create(tag: 'Anger')
d.expert.availability_blocks.create(day: 'FRI', timeslot: '2', expert_id: d.id)
d.expert.availability_blocks.create(day: 'SUN', timeslot: '1', expert_id: d.id)
d.save

a = User.create!( name: 'Jay-Z', email: 'jayz@jayz.com', password_digest: 'iowejfiowejfiowe')
a.expert.update_attributes(title: "American Royalty", company: "Rockafella Records", linkedin: "www.linkedin.com/jayz", photo: "http://media.npr.org/assets/music/news/2009/09/jayz.jpg?t=1312451295", active: true)
a.expert.user_id = a.id
a.expert.skills.create(tag: 'Entrepreneurship')
a.expert.skills.create(tag: 'Rapping')
a.expert.availability_blocks.create(day: 'MON', timeslot: '1', expert_id: a.id)
a.expert.availability_blocks.create(day: 'TUE', timeslot: '2', expert_id: a.id)
a.save


b = User.create!( name: 'Rick Ross', email: 'rick@rick.com', password_digest: 'iowejfiowejfiowe1')
b.expert.update_attributes(title: "BAUSS", company: "Maybach Music Group", linkedin: "www.linkedin.com/rick", photo: "http://www.themicbooth.com/uploads/1/7/8/3/17830169/9788641_orig.jpg", active: true)
b.expert.user_id = b.id
b.expert.skills.create(tag: 'Producing')
b.expert.skills.create(tag: 'Entrepreneurship')
b.expert.availability_blocks.create(day: 'WED', timeslot: '4', expert_id: b.id)
b.expert.availability_blocks.create(day: 'FRI', timeslot: '4', expert_id: b.id)
b.save


c = User.create!( name: 'Cool Herc', email: 'herc@herc.com', password_digest: 'iowejfiowejfiowe2')
c.expert.update_attributes(title: "Founder of Hip Hop", company: "Music", linkedin: "www.linkedin.com/herc", photo: "http://www.zulunation.com/KOOL%20HERC%202.jpg", active: true)
c.expert.user_id = c.id
c.expert.skills.create(tag: 'O.G.')
c.expert.skills.create(tag: 'Rapping')
c.expert.skills.create(tag: 'Dope')
c.expert.availability_blocks.create(day: 'SAT', timeslot: '4', expert_id: c.id)
c.expert.availability_blocks.create(day: 'SUN', timeslot: '4', expert_id: c.id)
c.save


j = User.create!( name: 'Beyonce', email: 'beyonce@beyonce.com', password_digest: 'iowejfiowejfiowe9')
j.expert.update_attributes(title: "Queen B.", company: "The World", linkedin: "www.linkedin.com/beyonce", photo: "http://blog.seattlepi.com/starsightingsandfashion/files/2013/08/instagram-300x225.jpg", active: true)
j.expert.user_id = j.id
j.expert.skills.create(tag: 'Singing')
j.expert.availability_blocks.create(day: 'FRI', timeslot: '4', expert_id: j.id)
j.save


e = User.create!( name: 'Bon Iver', email: 'boniver@boniver.com', password_digest: 'iowejfiowejfiowe4')
e.expert.update_attributes(title: "Kar's Dreamboat", company: "Wisconsin", linkedin: "www.linkedin.com/boniver", photo: "http://www.mhsmustangnews.com/wp-content/uploads/2013/03/bon-iver.jpg", active: true)
e.expert.user_id = e.id
e.expert.skills.create(tag: 'Guitar')
e.expert.availability_blocks.create(day: 'MON', timeslot: '2', expert_id: e.id)
e.save


f = User.create!( name: 'Ellie Goulding', email: 'ellie@ellie.com', password_digest: 'iowejfiowejfiowe5')
f.expert.update_attributes(title: "British", company: "Lights", linkedin: "www.linkedin.com/ellie", photo: "http://media.npr.org/assets/img/2012/08/10/ellie-goulding-stripes-815609593e41fd26d40dc0f2d9a8bd50bd123613-s6-c30.jpg", active: true)
f.expert.user_id = f.id
f.expert.skills.create(tag: 'Singing')
f.expert.availability_blocks.create(day: 'MON', timeslot: '3', expert_id: f.id)
f.save


g = User.create!( name: 'Bill Clinton', email: 'bill@bill.com', password_digest: 'iowejfiowejfiowe6')
g.expert.update_attributes(title: "Former Prez", company: "U.S.A.", linkedin: "www.linkedin.com/bill", photo: "http://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Bill_Clinton.jpg/220px-Bill_Clinton.jpg", active: true)
g.expert.user_id = g.id
g.expert.skills.create(tag: 'O.G.')
g.expert.availability_blocks.create(day: 'TUE', timeslot: '3', expert_id: g.id)
g.save



h = User.create!( name: 'Cory Booker', email: 'cory@cory.com', password_digest: 'iowejfiowejfiowe7')
h.expert.update_attributes(title: "Mayor", company: "Newark", linkedin: "www.linkedin.com/cory", photo: "http://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Cory_Booker_2011_Shankbone.JPG/220px-Cory_Booker_2011_Shankbone.JPG", active: true)
h.expert.user_id = h.id
h.expert.skills.create(tag: 'Cuteness')
h.expert.availability_blocks.create(day: 'MON', timeslot: '1', expert_id: h.id)
h.save



i = User.create!( name: 'NWA', email: 'nwa@nwa.com', password_digest: 'iowejfiowejfiowe8')
i.expert.update_attributes(title: "Angry Men", company: "Compton", linkedin: "www.linkedin.com/nwa", photo: "http://2.bp.blogspot.com/-vJm48ifI79M/UWwi5Uk0urI/AAAAAAAA7Ko/1db9DWZzxf0/s1600/dr-dre-nwa.jpg", active: true)
i.expert.user_id = i.id
i.expert.skills.create(tag: 'anger')
i.expert.skills.create(tag: 'dope')
i.expert.availability_blocks.create(day: 'SUN', timeslot: '1', expert_id: i.id)
i.save


















