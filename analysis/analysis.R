## TODO: ##
# learning effects and split half
# lmer slow on variable slope
# accuracy goes up faster in the color condition

## NOTES ##
#S15 did best in black in 1st and second half. Actually better with black. Lots of eye fatiue/blinking.
require(ggplot2)
library(plyr)
library('binom')
#library('languageR')
library('lme4')
library('arm')
library('sjPlot') #good package for plotting lmer
library("scales")
library("saccades")
data_dir = "C:\\Users\\me\\Google Drive\\classes_meetings\\HCI_f2015\\Ataglance\\CODE\\learning_at_a_glance\\data"
subjects = c('Colleen', 'Jeremy', 'Riz', 'Tricia', 'Wes')
learn_test = c('*learn*','*test*')

# load in all csv files
for (lt in 1:2) {
  for (s in 1:length(subjects)){
    csvlist = list.files(path=paste(data_dir, subjects[s], sep="\\") ,pattern=learn_test[lt])
    for (i in 1:length(csvlist)){
      tmp = read.csv(paste(data_dir, subjects[s], csvlist[i], sep="\\"));
      if (s == 1 & i == 1) {
        all_data = tmp;
      } else {
        all_data = rbind(all_data,tmp) # combine csvs into one
      }
    }
  }
  if (lt == 1){
    learn_data = all_data;
  } else {
    test_data = all_data;
  }
}

answer_data = subset(test_data,isAnswer==1)
ggplot(data = answer_data, aes(xmousex, ymousey, label=region)) + geom_point() + geom_text(size=10)




# ggplot(data=fx, aes(x = x, y = y,color=dur,size=dur)) +
#   geom_point() + 
#   scale_colour_gradientn(colours = rev(rainbow(20)))



#filter NA
# all_data = subset(all_data,Fixation =='true')
# 
# just_eyedata = data.frame(x=all_data$X,y=all_data$Y,
#                 time=seq.int(1, nrow(all_data)),trial=rep.int(1, nrow(all_data)))
# fx = detect.fixations(just_eyedata,lambda = 15)
# diagnostic.plot(just_eyedata, fx)
# 
# ggplot(data=fx, aes(x = x, y = y,color=dur,size=dur)) +
#   geom_point() + 
#   scale_colour_gradientn(colours = rev(rainbow(20)))

# ggplot(data=all_data, aes(x = xmousex, y = ymousey,color=seq.int(1, nrow(all_data)))) +
#   geom_point() + scale_colour_gradientn(colours = rainbow(10))

# ## Aggregrate data for plotting
# #ss = subset(all_data,rej_trial==0)
# accuracy <- ddply(all_data, c('iscolor'), summarise,
#                   acc = mean(correct==1),
#                   CI  = 1.96*sqrt(mean(correct==1)*(1-mean(correct==1))/length(correct)))
# 
# # binom.confint(sum(all_data$correct==1),length(all_data$correct),method="logit")[5] # could be useful
# 
# ## 4 colors for the interaction of location and color by subject
# # ggplot(data=accuracy, aes(x = factor(subjID), y = acc,fill=interaction(as.factor(location),iscolor))) +
# #        geom_bar(stat="identity", position=position_dodge()) +
# #        geom_errorbar(aes(ymax=acc+CI, ymin=acc-CI), position="dodge")
# 
# # make a renaming function
# position_labeller <- function(variable,value){ #func to rename
#   # this bit renames factors
#   position_names <- list(
#     '-6'="5 spaces left",
#     '5'="6 spaces right"
#   )
#   return(position_names[value])
# }
# 
# ggplot(data=all_data, aes(x = factor(iscolor), y = mean(resp_is_flanker),fill=iscolor)) + #,
#   geom_bar(stat="identity", position=position_dodge())
# ggplot(all_data, aes(x=cond_trial_num_scale, y=resp_is_flanker)) +
#   geom_line() + stat_smooth(method="glm", family="binomial", se=TRUE,data=all_data,size=2) + coord_cartesian(ylim = c(.3, .65))
# 
# # overall accuracy
# ggplot(data=accuracy, aes(x = factor(iscolor), y = acc,fill=iscolor)) + #,
#   geom_bar(stat="identity", position=position_dodge()) +
#   geom_errorbar(aes(ymax=acc+CI, ymin=acc-CI), position="dodge",color='black') +
#   scale_fill_manual(values=c("#545454", "blue"),labels=c('Black','Color')) +
#   scale_x_discrete(labels=c('Black','Color')) +
#   scale_y_continuous(breaks = seq(.4, .5, .025),labels=function(x) format(x,digits=2)) +
#   coord_cartesian(ylim=c(.4, .5)) +
#   ylab("Probabillity Correct +/- 95% CI") +
#   xlab("Color Condition") +
#   theme(text = element_text(size=75))
# 
# # overall rt
# ggplot(data=all_data, aes(x = factor(iscolor), y = reaction_time,fill=iscolor)) + #,
#   geom_bar(stat="identity", position=position_dodge()) +
#   scale_fill_manual(values=c("#545454", "blue"),labels=c('Black','Color')) +
#   scale_x_discrete(labels=c('Black','Color')) +
#   scale_y_continuous(breaks = seq(4.9, 5.1, .025),labels=function(x) format(x,digits=4)) +
#   coord_cartesian(ylim=c(4.9, 5.1)) +
#   xlab("Color Condition") +
#   theme(text = element_text(size=75))
# 
# # rt distrobution
# ggplot( all_data , aes( x=reaction_time) ) +
#   #   we need to make it transparent so we can see the overlap
#   geom_density(aes(color=factor(iscolor)), size=2)
# 
# geom_line(stat="pdf", size=3) +
#   scale_y_continuous( labels=percent ) + facet_wrap(~subjID) +
#   #   set the curve colors
#   scale_fill_manual( values=c( "red","blue" ) ) +
#   #   make the legend a little prettier
#   guides( fill = guide_legend( title = "Condition" ,
#                                #   change font-face to remove bold
#                                title.theme     = element_text( face="plain", angle=0 ) ,
#                                #   remove the black border around keys
#                                override.aes    = list( colour="white" )
#   )
#   )
# 
# 
# 
# # ggplot(all_data, aes(x=cond_trial_num_scale, y=correct)) +
# #   geom_point() + stat_smooth(method="glm", family="binomial", se=TRUE,data=all_data,size=2) + coord_cartesian(ylim = c(.3, .65)) +
# #   scale_fill_manual(values=c("#545454", "blue")) +
# #   ylab("Prob. Correct & SE") +
# #   xlab("Trial Number in Color Condition") +
# #   ggtitle("Probability Correct by color, location, and trial number.") +
# #   theme(text = element_text(size=20)) + scale_color_manual(values=c("black","blue"))
# # # ggsave(filename = 'learning_effects.png',height=40,width=55,units='cm')
# # # + facet_wrap( ~ subjID,ncol = 5)
# 
# ##########################################
# #### LMER ################################
# ##########################################
# 
# #curve(binomial()$linkinv(x), from = -5, to = 5, xlab = "logit", ylab = "probability")
# ## learning curve modelspack
# 
# # more random slope, not location though, that's kind of a waste of cpu given the low variance
# color_model = glmer(correct~cond_trial_num_scale*iscolor + (cond_trial_num_scale|subjID) + (1|stimuli) + (1|location) +
#                       (1|subjID:stimuli) + (1|subjID:stimuli:iscolor) + (1|location:iscolor),data=all_data, family=binomial(link="logit"))
# null_model  = glmer(correct~cond_trial_num_scale + (cond_trial_num_scale|subjID) + (1|stimuli) + (1|location) + (1|subjID:stimuli),data=all_data, family=binomial(link="logit"))
# 
# 
# null_model  = glmer(correct~cond_trial_num_scale + (0+cond_trial_num_scale|subjID) + (1|stimuli) + (1|subjID:stimuli),
#                     data=all_data, family=binomial(link="logit"))
# 
# #seperated into location errors. Stick with errors in general since this has a limited number of options
# color_model = glmer(correct~cond_trial_num_scale*iscolor + (0+cond_trial_num_scale|subjID) + (1|stimuli) + 
#                       (1|subjID:stimuli) + (1|subjID:stimuli:iscolor),data=all_data, family=binomial(link="logit")) #pred correct
# 
# color_model = glmer(resp_is_flanker~cond_trial_num_scale*iscolor + (0+cond_trial_num_scale|subjID) + (1|stimuli) + 
#                       (1|subjID:stimuli) + (1|subjID:stimuli:iscolor),data=subset(all_data,correct==1 | resp_is_flanker ==T), family=binomial(link="logit")) #pred correct
# 
# color_model = glmer(correct~cond_trial_num_scale*iscolor + (0+cond_trial_num_scale|subjID) + (1|stimuli) + 
#                       (1|subjID:stimuli) + (1|subjID:stimuli:iscolor),data=subset(all_data,resp_is_flanker ==F), family=binomial(link="logit")) #pred correct
# 
# 
# 
# anova(null_model,color_model)
# fort = fortify(null_model)
# ggplot(fort,aes(x=cond_trial_num_scale,y=invlogit(.fitted),color=iscolor)) + geom_smooth(se = F,size = 2)
# ggplot(fort,aes(x=cond_trial_num_scale,y=invlogit(.fitted),color=iscolor)) + geom_smooth(se = F,size = 2)
# 
# new_x = rep(seq(from = 0, to = 1, by =.01),2)
# new_color = as.factor(c(rep(0,length(new_x)/1),rep(1,length(new_x)/1)))
# new_data = data.frame(cond_trial_num_scale=new_x,iscolor=new_color)
# 
# new_data$pred = predict(color_model,newdata=new_data,type='response',re.form=NA) #
# 
# max(all_data$cond_trial_num)
# unscale_trialnum <- function(variable,value){ #func to rename
#   return(value*676)
# }
# 
# ggplot(new_data, aes(x=cond_trial_num_scale,y=pred,group=iscolor,color=iscolor)) + geom_line(size=7) +
#   ylab("Probability Correct") +
#   xlab("Trial Number in Color Condition") +
#   ggtitle("Model fits for 19 UCSD Undergraduates") +
#   scale_y_continuous(breaks = seq(0, 1, .025),labels=function(x) format(x,digits=2)) +
#   scale_x_continuous(breaks = seq(0, 1, .1),labels=function(x) round(x *338)) +
#   scale_color_manual(values=c("black", "blue"),labels=c('Black Letters','Color Letters'),name='') +
#   theme(text = element_text(size=70,face='bold'),legend.position=c(.12,.97),legend.background = element_rect(fill="transparent"))
# 
# theme(aspect.ratio=1) + facet_wrap(~Subject)
# 
# 
# 
# anova(null_model,color_model,test='LRT')
# summary(color_model)
# 
# curve( invlogit( cbind(1, x) %*% model.coefs ), add=TRUE )
# library('effects')
# 
# 
# sjp.glmer(color_model)
# # For BLACK TEXT, we see about a 9% improvement from 0 to max trials, e.g. rescaled to 1
# invlogit(fixef(color_model)[1]+fixef(color_model)[2])-invlogit(fixef(color_model)[1])
# 
# # For COLOR TEXT, we see about a 21% improvement from 0 to max trials, e.g. rescaled to 1
# invlogit(fixef(color_model)[1]+fixef(color_model)[3]+fixef(color_model)[4])-invlogit(fixef(color_model)[1]+fixef(color_model)[3])
# 
# # after about 45 minutes, subjects are 8% more accurate with color
# invlogit(fixef(color_model)[1]+fixef(color_model)[3]+fixef(color_model)[4])-invlogit(fixef(color_model)[1]+fixef(color_model)[2])
# 
# #TODO PREDICT()
